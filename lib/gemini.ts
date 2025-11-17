/**
 * Gemini AI Integration for intelligent feedback
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

type MistakeType =
  | "ARTICLE"
  | "PREPOSITION"
  | "TENSE"
  | "SUBJECT_VERB_AGREEMENT"
  | "WORD_ORDER"
  | "VOCABULARY"
  | "SPELLING"
  | "PLURAL_SINGULAR"
  | "PRONOUN"
  | "ADJECTIVE_ADVERB"
  | "COMPARATIVE_SUPERLATIVE"
  | "MODAL_VERB"
  | "PASSIVE_ACTIVE"
  | "CONDITIONAL"
  | "OTHER";

type ChallengeType =
  | "SELECT"
  | "ASSIST"
  | "TRANSLATION"
  | "REVERSE_TRANSLATION"
  | "FILL_IN_BLANK"
  | "MATCHING_PAIRS"
  | "WORD_ORDER";

interface AIFeedbackResponse {
  explanation: string;
  grammarRule?: string;
  examples?: string[];
  mistakeType?: MistakeType;
  commonMistakeForVietnamese?: string;
  encouragement: string;
  alternatives?: string[];
}

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Tạo AI feedback sử dụng Gemini
 */
export async function generateAIFeedback(
  userAnswer: string,
  correctAnswer: string,
  question: string,
  challengeType: ChallengeType,
  isCorrect: boolean,
  userMistakeHistory?: MistakeType[]
): Promise<AIFeedbackResponse> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    const historyContext = userMistakeHistory && userMistakeHistory.length > 0
      ? `\n\nLịch sử lỗi gần đây của người học: ${userMistakeHistory.slice(-5).join(", ")}`
      : "";

    const prompt = `
Bạn là giáo viên tiếng Anh chuyên nghiệp, chuyên dạy cho người Việt Nam. Hãy phân tích câu trả lời và đưa ra phản hồi chi tiết.

**Loại bài tập:** ${getChallengeTypeName(challengeType)}
**Câu hỏi:** ${question}
**Câu trả lời:** ${userAnswer}
**Đáp án đúng:** ${correctAnswer}
**Kết quả:** ${isCorrect ? "Đúng" : "Sai"}
${historyContext}

Hãy trả về JSON với cấu trúc sau (không thêm markdown formatting):
{
  "explanation": "Giải thích chi tiết (2-3 câu, bằng tiếng Việt, xưng hô là 'bạn')",
  "grammarRule": "Quy tắc ngữ pháp liên quan (nếu có)",
  "examples": ["Ví dụ 1", "Ví dụ 2", "Ví dụ 3"],
  "mistakeType": "Loại lỗi (ARTICLE, PREPOSITION, TENSE, SUBJECT_VERB_AGREEMENT, WORD_ORDER, VOCABULARY, SPELLING, PLURAL_SINGULAR, PRONOUN, ADJECTIVE_ADVERB, COMPARATIVE_SUPERLATIVE, MODAL_VERB, PASSIVE_ACTIVE, CONDITIONAL, OTHER)",
  "commonMistakeForVietnamese": "Lỗi thường gặp với người Việt (nếu sai)",
  "encouragement": "Lời động viên ngắn gọn (xưng hô là 'bạn', không dùng 'em')",
  "alternatives": ["Các cách nói khác (nếu đúng)"]
}

**Yêu cầu quan trọng:**
1. LUÔN xưng hô là "bạn", KHÔNG BAO GIỜ dùng "em"
2. Nếu đúng: Khen ngợi và giải thích tại sao đúng
3. Nếu sai: 
   - Giải thích rõ ràng lỗi sai
   - Chỉ ra quy tắc ngữ pháp
   - Đưa ra ví dụ minh họa
   - Giải thích lỗi thường gặp với người Việt
4. Động viên phù hợp với mức độ (đúng/sai, lần đầu/nhiều lần sai)
5. Sử dụng ngôn ngữ dễ hiểu, thân thiện
5. Trả về ĐÚNG định dạng JSON, không thêm \`\`\`json hoặc text thừa
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const feedback = JSON.parse(cleanedText) as AIFeedbackResponse;

    return feedback;
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    
    // Fallback to basic feedback
    return {
      explanation: isCorrect
        ? `Chính xác! Đáp án "${correctAnswer}" là đúng.`
        : `Đáp án đúng là "${correctAnswer}". Hãy xem lại và thử lại nhé!`,
      encouragement: isCorrect
        ? "Tuyệt vời! Tiếp tục phát huy!"
        : "Đừng nản chí! Học từ sai lầm sẽ giúp bạn tiến bộ nhanh hơn.",
      mistakeType: isCorrect ? undefined : "OTHER",
    };
  }
}

/**
 * Tạo gợi ý thích ứng sử dụng Gemini
 */
export async function generateAdaptiveHint(
  question: string,
  correctAnswer: string,
  userMistakeHistory: MistakeType[],
  attemptCount: number,
  hintLevel: "grammar_tip" | "example" | "partial_answer"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    const historyContext = userMistakeHistory.length > 0
      ? `\n\nLịch sử lỗi gần đây: ${userMistakeHistory.slice(-5).join(", ")}`
      : "";

    let levelInstruction = "";
    if (hintLevel === "grammar_tip") {
      levelInstruction = "Đưa ra 1 mẹo ngữ pháp ngắn gọn (1 câu) liên quan đến câu hỏi. Xưng hô là 'bạn'.";
    } else if (hintLevel === "example") {
      levelInstruction = "Đưa ra 1 ví dụ tương tự để tham khảo. Xưng hô là 'bạn'.";
    } else {
      levelInstruction = "Đưa ra một phần của đáp án (khoảng 30-50% đáp án) để gợi ý. Xưng hô là 'bạn'.";
    }

    const prompt = `
Bạn là giáo viên tiếng Anh. Hãy tạo gợi ý cho người học.

**Câu hỏi:** ${question}
**Đáp án đúng:** ${correctAnswer}
**Số lần thử:** ${attemptCount}
${historyContext}

**Yêu cầu:** ${levelInstruction}
**Lưu ý:** LUÔN xưng hô là "bạn", KHÔNG dùng "em".

Chỉ trả về nội dung gợi ý (không giải thích thêm, không format markdown).
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating adaptive hint:", error);
    
    // Fallback hints
    if (hintLevel === "grammar_tip") {
      return "💡 Hãy chú ý đến ngữ pháp và cấu trúc câu.";
    } else if (hintLevel === "example") {
      return `📚 Ví dụ tương tự: "${correctAnswer}"`;
    } else {
      const words = correctAnswer.split(" ");
      const partial = words.slice(0, Math.ceil(words.length / 2)).join(" ");
      return `🔍 Gợi ý: Bắt đầu bằng "${partial}..."`;
    }
  }
}

/**
 * Phân tích điểm yếu và đưa ra gợi ý cải thiện
 */
export async function generateImprovementSuggestion(
  mistakeType: MistakeType,
  mistakeCount: number
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      },
    });

    const prompt = `
Bạn là giáo viên tiếng Anh. Người học đã mắc lỗi về ${getMistakeTypeNameVietnamese(mistakeType)} ${mistakeCount} lần.

Hãy đưa ra gợi ý cải thiện cụ thể (2-3 câu ngắn gọn):
- Phương pháp học hiệu quả
- Tài nguyên/bài tập nên làm
- Mẹo ghi nhớ

**Lưu ý:** LUÔN xưng hô là "bạn", KHÔNG dùng "em".
Trả về văn bản thuần, không format markdown.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating improvement suggestion:", error);
    return `Hãy ôn lại phần ${getMistakeTypeNameVietnamese(mistakeType)} và làm thêm bài tập.`;
  }
}

/**
 * Lấy tên loại bài tập
 */
function getChallengeTypeName(type: ChallengeType): string {
  const names: Record<ChallengeType, string> = {
    SELECT: "Chọn đáp án đúng",
    ASSIST: "Chọn nghĩa đúng",
    TRANSLATION: "Dịch sang tiếng Anh",
    REVERSE_TRANSLATION: "Dịch sang tiếng Việt",
    FILL_IN_BLANK: "Điền vào chỗ trống",
    MATCHING_PAIRS: "Ghép cặp",
    WORD_ORDER: "Sắp xếp từ",
  };
  return names[type];
}

/**
 * Lấy tên loại lỗi bằng tiếng Việt
 */
function getMistakeTypeNameVietnamese(type: MistakeType): string {
  const names: Record<MistakeType, string> = {
    ARTICLE: "mạo từ",
    PREPOSITION: "giới từ",
    TENSE: "thì",
    SUBJECT_VERB_AGREEMENT: "sự hòa hợp chủ ngữ - động từ",
    WORD_ORDER: "trật tự từ",
    VOCABULARY: "từ vựng",
    SPELLING: "chính tả",
    PLURAL_SINGULAR: "số ít/số nhiều",
    PRONOUN: "đại từ",
    ADJECTIVE_ADVERB: "tính từ/trạng từ",
    COMPARATIVE_SUPERLATIVE: "so sánh",
    MODAL_VERB: "động từ khuyết thiếu",
    PASSIVE_ACTIVE: "câu bị động/chủ động",
    CONDITIONAL: "câu điều kiện",
    OTHER: "ngữ pháp cơ bản",
  };
  return names[type];
}
