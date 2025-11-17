"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import {
  aiFeedbackHistory,
  confusingWords,
  grammarWeaknesses,
  userMistakes,
} from "@/db/schema";
import { calculateSeverity } from "@/lib/ai-feedback";
import { generateImprovementSuggestion as generateAISuggestion } from "@/lib/gemini";

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

/**
 * Lưu lỗi của người dùng vào database
 */
export const recordUserMistake = async (
  challengeId: number,
  mistakeType: MistakeType,
  userAnswer: string,
  correctAnswer: string,
  explanation: string
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Lưu lỗi vào bảng userMistakes
    await db.insert(userMistakes).values({
      userId,
      challengeId,
      mistakeType,
      userAnswer,
      correctAnswer,
      explanation,
    });

    // Cập nhật hoặc tạo mới grammar weakness
    await updateGrammarWeakness(userId, mistakeType);

    // Phát hiện và lưu các từ dễ nhầm lẫn
    await detectConfusingWords(userId, userAnswer, correctAnswer);

    revalidatePath("/learn");
    revalidatePath("/lesson");

    return { success: true };
  } catch (error) {
    console.error("Error recording mistake:", error);
    throw new Error("Failed to record mistake");
  }
};

/**
 * Cập nhật điểm yếu ngữ pháp
 */
async function updateGrammarWeakness(userId: string, mistakeType: MistakeType) {
  // Kiểm tra xem đã có record chưa
  const existing = await db.query.grammarWeaknesses.findFirst({
    where: and(
      eq(grammarWeaknesses.userId, userId),
      eq(grammarWeaknesses.mistakeType, mistakeType)
    ),
  });

  if (existing) {
    // Cập nhật count và severity
    const newCount = existing.count + 1;
    const newSeverity = calculateSeverity(mistakeType, newCount);

    await db
      .update(grammarWeaknesses)
      .set({
        count: newCount,
        lastOccurrence: new Date(),
        severity: newSeverity,
      })
      .where(eq(grammarWeaknesses.id, existing.id));
  } else {
    // Tạo mới
    await db.insert(grammarWeaknesses).values({
      userId,
      mistakeType,
      count: 1,
      severity: calculateSeverity(mistakeType, 1),
    });
  }
}

/**
 * Phát hiện các từ dễ nhầm lẫn
 */
async function detectConfusingWords(
  userId: string,
  userAnswer: string,
  correctAnswer: string
) {
  const userWords = userAnswer.toLowerCase().split(/\s+/);
  const correctWords = correctAnswer.toLowerCase().split(/\s+/);

  // Tìm các từ khác nhau
  for (let i = 0; i < Math.min(userWords.length, correctWords.length); i++) {
    if (userWords[i] !== correctWords[i]) {
      const word1 = userWords[i];
      const word2 = correctWords[i];

      // Kiểm tra xem cặp từ này đã được ghi nhận chưa
      const existing = await db.query.confusingWords.findFirst({
        where: and(
          eq(confusingWords.userId, userId),
          sql`(${confusingWords.word1} = ${word1} AND ${confusingWords.word2} = ${word2}) OR
              (${confusingWords.word1} = ${word2} AND ${confusingWords.word2} = ${word1})`
        ),
      });

      if (existing) {
        // Cập nhật count
        await db
          .update(confusingWords)
          .set({
            mistakeCount: existing.mistakeCount + 1,
            lastMistake: new Date(),
          })
          .where(eq(confusingWords.id, existing.id));
      } else {
        // Tạo mới
        const explanation = generateConfusingWordsExplanation(word1, word2);
        await db.insert(confusingWords).values({
          userId,
          word1,
          word2,
          mistakeCount: 1,
          explanation,
        });
      }
    }
  }
}

/**
 * Tạo giải thích cho các từ dễ nhầm lẫn
 */
function generateConfusingWordsExplanation(word1: string, word2: string): string {
  // Có thể mở rộng với database các từ dễ nhầm lẫn
  const commonPairs: Record<string, string> = {
    "affect-effect": "Affect là động từ (ảnh hưởng), Effect là danh từ (hiệu quả)",
    "accept-except": "Accept = chấp nhận, Except = ngoại trừ",
    "there-their-theyre": "There = ở đó, Their = của họ, They're = họ là",
    "your-youre": "Your = của bạn, You're = bạn là",
    "its-its": "Its = của nó, It's = nó là",
    "to-too-two": "To = đến, Too = quá, Two = số 2",
    "then-than": "Then = sau đó, Than = hơn (so sánh)",
  };

  const key = `${word1}-${word2}`;
  return (
    commonPairs[key] ||
    `"${word1}" và "${word2}" thường bị nhầm lẫn. Hãy chú ý nghĩa và cách dùng của từng từ.`
  );
}

/**
 * Lấy lịch sử lỗi của người dùng
 */
export const getUserMistakeHistory = async (limit: number = 20) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const mistakes = await db.query.userMistakes.findMany({
    where: eq(userMistakes.userId, userId),
    orderBy: [desc(userMistakes.timestamp)],
    limit,
  });

  return mistakes;
};

/**
 * Lấy điểm yếu ngữ pháp của người dùng
 */
export const getUserGrammarWeaknesses = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const weaknesses = await db.query.grammarWeaknesses.findMany({
    where: eq(grammarWeaknesses.userId, userId),
    orderBy: [desc(grammarWeaknesses.severity), desc(grammarWeaknesses.count)],
  });

  return weaknesses;
};

/**
 * Lấy các từ dễ nhầm lẫn
 */
export const getUserConfusingWords = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const words = await db.query.confusingWords.findMany({
    where: eq(confusingWords.userId, userId),
    orderBy: [desc(confusingWords.mistakeCount)],
  });

  return words;
};

/**
 * Lưu phản hồi AI
 */
export const recordAIFeedback = async (
  challengeId: number,
  feedbackType: "explanation" | "hint" | "encouragement",
  content: string
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.insert(aiFeedbackHistory).values({
      userId,
      challengeId,
      feedbackType,
      content,
    });

    return { success: true };
  } catch (error) {
    console.error("Error recording AI feedback:", error);
    throw new Error("Failed to record AI feedback");
  }
};

/**
 * Đánh dấu phản hồi AI có hữu ích không
 */
export const markFeedbackHelpful = async (
  feedbackId: number,
  wasHelpful: boolean
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .update(aiFeedbackHistory)
      .set({ wasHelpful })
      .where(
        and(
          eq(aiFeedbackHistory.id, feedbackId),
          eq(aiFeedbackHistory.userId, userId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error marking feedback helpful:", error);
    throw new Error("Failed to mark feedback helpful");
  }
};

/**
 * Lấy thống kê lỗi theo loại
 */
export const getMistakeStatistics = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const mistakes = await db.query.userMistakes.findMany({
    where: eq(userMistakes.userId, userId),
  });

  // Thống kê theo loại lỗi
  const statistics: Record<MistakeType, number> = {} as Record<
    MistakeType,
    number
  >;

  mistakes.forEach((mistake: any) => {
    const type = mistake.mistakeType as MistakeType;
    statistics[type] = (statistics[type] || 0) + 1;
  });

  // Sắp xếp theo số lần xuất hiện
  const sorted = Object.entries(statistics)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      type: type as MistakeType,
      count,
      percentage: Math.round((count / mistakes.length) * 100),
    }));

  return {
    total: mistakes.length,
    byType: sorted,
  };
};

/**
 * Lấy gợi ý cải thiện dựa trên điểm yếu
 */
export const getImprovementSuggestions = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const weaknesses = await getUserGrammarWeaknesses();

  const suggestions = await Promise.all(
    weaknesses.slice(0, 3).map(async (weakness: any) => {
      // Sử dụng Gemini AI để tạo gợi ý cá nhân hóa
      const aiSuggestion = await generateAISuggestion(
        weakness.mistakeType as MistakeType,
        weakness.count
      );

      return {
        mistakeType: weakness.mistakeType,
        severity: weakness.severity,
        count: weakness.count,
        suggestion: aiSuggestion,
      };
    })
  );

  return suggestions;
};

/**
 * Tạo gợi ý cải thiện (fallback)
 */
function generateFallbackSuggestion(
  mistakeType: MistakeType,
  count: number
): string {
  const suggestions: Record<MistakeType, string> = {
    ARTICLE: "Hãy ôn lại quy tắc sử dụng mạo từ a/an/the và làm thêm bài tập về mạo từ.",
    PREPOSITION:
      "Học thuộc các cụm động từ với giới từ (phrasal verbs) và danh sách giới từ theo chủ đề.",
    TENSE: "Ôn lại các thì trong tiếng Anh và dấu hiệu nhận biết từng thì.",
    SUBJECT_VERB_AGREEMENT:
      "Chú ý quy tắc chia động từ theo chủ ngữ số ít/số nhiều.",
    WORD_ORDER:
      "Luyện tập sắp xếp từ và ghi nhớ cấu trúc câu cơ bản S + V + O.",
    VOCABULARY: "Mở rộng vốn từ vựng theo chủ đề và học từ trong ngữ cảnh.",
    SPELLING: "Luyện tập chính tả thường xuyên với các từ khó.",
    PLURAL_SINGULAR: "Ôn lại quy tắc thêm -s/-es và các danh từ bất quy tắc.",
    PRONOUN: "Học thuộc bảng đại từ nhân xưng, sở hữu, phản thân.",
    ADJECTIVE_ADVERB: "Phân biệt rõ tính từ và trạng từ, cách thêm -ly.",
    COMPARATIVE_SUPERLATIVE: "Học quy tắc so sánh hơn và so sánh nhất.",
    MODAL_VERB: "Ôn lại các động từ khuyết thiếu và cách sử dụng.",
    PASSIVE_ACTIVE: "Luyện tập chuyển đổi câu chủ động - bị động.",
    CONDITIONAL: "Học thuộc cấu trúc 3 loại câu điều kiện.",
    OTHER: "Tiếp tục luyện tập và chú ý đến các lỗi cơ bản.",
  };

  const base = suggestions[mistakeType];
  if (count >= 10) {
    return `⚠️ QUAN TRỌNG: ${base} Bạn đã mắc lỗi này ${count} lần.`;
  } else if (count >= 5) {
    return `⚡ CHÚ Ý: ${base} Bạn đã mắc lỗi này ${count} lần.`;
  }

  return base;
}
