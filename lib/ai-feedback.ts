/**
 * AI-Powered Feedback System
 * Cung cấp giải thích đáp án, phân tích lỗi và gợi ý thích ứng
 */

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

interface FeedbackResult {
  isCorrect: boolean;
  explanation: string;
  grammarRule?: string;
  examples?: string[];
  alternatives?: string[];
  mistakeType?: MistakeType;
  commonMistakeForVietnamese?: string;
  encouragement: string;
}

interface AdaptiveHint {
  level: "grammar_tip" | "example" | "partial_answer";
  content: string;
  showNow: boolean;
}

/**
 * Phân tích đáp án và tạo feedback chi tiết
 */
export function analyzeAnswer(
  userAnswer: string,
  correctAnswer: string,
  question: string,
  challengeType: ChallengeType,
  userMistakeHistory?: MistakeType[]
): FeedbackResult {
  const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

  if (isCorrect) {
    return generateCorrectFeedback(userAnswer, correctAnswer, challengeType);
  }

  return generateIncorrectFeedback(
    userAnswer,
    correctAnswer,
    question,
    challengeType,
    userMistakeHistory
  );
}

/**
 * Chuẩn hóa đáp án để so sánh
 */
function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Tạo feedback cho đáp án đúng
 */
function generateCorrectFeedback(
  userAnswer: string,
  correctAnswer: string,
  challengeType: ChallengeType
): FeedbackResult {
  const encouragements = [
    "Tuyệt vời! Bạn đã hiểu rất rõ!",
    "Chính xác! Tiếp tục phát huy nhé!",
    "Hoàn hảo! Bạn đang tiến bộ rất tốt!",
    "Xuất sắc! Kiến thức của bạn rất vững!",
    "Đúng rồi! Bạn thật giỏi!",
  ];

  const grammarRules: Record<ChallengeType, string> = {
    SELECT: "Bạn đã chọn đúng đáp án phù hợp với ngữ cảnh.",
    ASSIST: "Bạn đã hoàn thành câu một cách chính xác.",
    TRANSLATION: "Bản dịch của bạn chính xác về mặt ngữ nghĩa và ngữ pháp.",
    REVERSE_TRANSLATION: "Bạn đã dịch ngược lại chính xác.",
    FILL_IN_BLANK: "Bạn đã điền đúng từ vào chỗ trống.",
    MATCHING_PAIRS: "Bạn đã ghép các cặp từ chính xác.",
    WORD_ORDER: "Bạn đã sắp xếp từ đúng thứ tự.",
  };

  return {
    isCorrect: true,
    explanation: `${encouragements[Math.floor(Math.random() * encouragements.length)]} ${grammarRules[challengeType]}`,
    encouragement: "Hãy tiếp tục học tập để nâng cao trình độ!",
  };
}

/**
 * Tạo feedback cho đáp án sai
 */
function generateIncorrectFeedback(
  userAnswer: string,
  correctAnswer: string,
  question: string,
  challengeType: ChallengeType,
  userMistakeHistory?: MistakeType[]
): FeedbackResult {
  const mistakeType = detectMistakeType(userAnswer, correctAnswer, challengeType);
  const grammarRule = getGrammarRule(mistakeType);
  const examples = getExamples(mistakeType);
  const alternatives = getAlternatives(correctAnswer);
  const commonMistake = getCommonMistakeForVietnamese(mistakeType);

  const explanation = generateExplanation(
    userAnswer,
    correctAnswer,
    mistakeType
  );

  // Thêm lời động viên dựa trên lịch sử lỗi
  const encouragement = generateEncouragement(mistakeType, userMistakeHistory);

  return {
    isCorrect: false,
    explanation,
    grammarRule,
    examples,
    alternatives,
    mistakeType,
    commonMistakeForVietnamese: commonMistake,
    encouragement,
  };
}

/**
 * Phát hiện loại lỗi
 */
function detectMistakeType(
  userAnswer: string,
  correctAnswer: string,
  challengeType: ChallengeType
): MistakeType {
  const userWords = userAnswer.toLowerCase().split(/\s+/);
  const correctWords = correctAnswer.toLowerCase().split(/\s+/);

  // Kiểm tra lỗi mạo từ
  if (hasArticleError(userWords, correctWords)) return "ARTICLE";

  // Kiểm tra lỗi giới từ
  if (hasPrepositionError(userWords, correctWords)) return "PREPOSITION";

  // Kiểm tra lỗi thì
  if (hasTenseError(userAnswer, correctAnswer)) return "TENSE";

  // Kiểm tra lỗi sự hòa hợp chủ ngữ - động từ
  if (hasSubjectVerbAgreementError(userAnswer, correctAnswer))
    return "SUBJECT_VERB_AGREEMENT";

  // Kiểm tra lỗi trật tự từ
  if (challengeType === "WORD_ORDER") return "WORD_ORDER";

  // Kiểm tra lỗi số ít/số nhiều
  if (hasPluralError(userWords, correctWords)) return "PLURAL_SINGULAR";

  // Kiểm tra lỗi từ vựng
  if (hasVocabularyError(userWords, correctWords)) return "VOCABULARY";

  return "OTHER";
}

/**
 * Kiểm tra lỗi mạo từ
 */
function hasArticleError(userWords: string[], correctWords: string[]): boolean {
  const articles = ["a", "an", "the"];
  const userArticles = userWords.filter((w) => articles.includes(w));
  const correctArticles = correctWords.filter((w) => articles.includes(w));

  return userArticles.join() !== correctArticles.join();
}

/**
 * Kiểm tra lỗi giới từ
 */
function hasPrepositionError(userWords: string[], correctWords: string[]): boolean {
  const prepositions = [
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "from",
    "by",
    "about",
    "of",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
  ];

  const userPreps = userWords.filter((w) => prepositions.includes(w));
  const correctPreps = correctWords.filter((w) => prepositions.includes(w));

  return userPreps.join() !== correctPreps.join();
}

/**
 * Kiểm tra lỗi thì
 */
function hasTenseError(userAnswer: string, correctAnswer: string): boolean {
  const userTense = getTense(userAnswer);
  const correctTense = getTense(correctAnswer);

  return userTense !== correctTense;
}

/**
 * Xác định thì của câu
 */
function getTense(sentence: string): string {
  if (/\b(will|shall|going to)\b/i.test(sentence)) return "future";
  if (/\b(ed|was|were|had|did)\b/i.test(sentence)) return "past";
  return "present";
}

/**
 * Kiểm tra lỗi sự hòa hợp chủ ngữ - động từ
 */
function hasSubjectVerbAgreementError(
  userAnswer: string,
  correctAnswer: string
): boolean {
  // Pattern đơn giản để phát hiện lỗi cơ bản
  const patterns = [
    { user: /\b(he|she|it)\s+(are|do)\b/i, correct: /\b(he|she|it)\s+(is|does)\b/i },
    { user: /\b(I|you|we|they)\s+(is|does)\b/i, correct: /\b(I|you|we|they)\s+(are|do)\b/i },
  ];

  return patterns.some(
    (p) => p.user.test(userAnswer) && p.correct.test(correctAnswer)
  );
}

/**
 * Kiểm tra lỗi số ít/số nhiều
 */
function hasPluralError(userWords: string[], correctWords: string[]): boolean {
  // Kiểm tra sự khác biệt về hậu tố -s/-es
  for (let i = 0; i < Math.min(userWords.length, correctWords.length); i++) {
    const userWord = userWords[i];
    const correctWord = correctWords[i];

    if (
      (userWord + "s" === correctWord ||
        userWord + "es" === correctWord ||
        correctWord + "s" === userWord ||
        correctWord + "es" === userWord) &&
      userWord !== correctWord
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Kiểm tra lỗi từ vựng
 */
function hasVocabularyError(userWords: string[], correctWords: string[]): boolean {
  // Nếu có từ hoàn toàn khác nhau (không phải lỗi ngữ pháp)
  const differentWords = userWords.filter((w, i) => w !== correctWords[i]);
  return differentWords.length > 0;
}

/**
 * Lấy quy tắc ngữ pháp tương ứng
 */
function getGrammarRule(mistakeType: MistakeType): string {
  const rules: Record<MistakeType, string> = {
    ARTICLE: "Quy tắc mạo từ: Dùng 'a/an' cho danh từ đếm được số ít không xác định, 'the' cho danh từ xác định.",
    PREPOSITION: "Quy tắc giới từ: Mỗi động từ/tính từ thường đi với một giới từ cố định.",
    TENSE: "Quy tắc thì: Chọn thì phù hợp với thời gian và ngữ cảnh của câu.",
    SUBJECT_VERB_AGREEMENT: "Quy tắc hòa hợp: Chủ ngữ số ít dùng động từ số ít, số nhiều dùng động từ số nhiều.",
    WORD_ORDER: "Quy tắc trật tự từ: Thường theo cấu trúc Chủ ngữ + Động từ + Tân ngữ (SVO).",
    VOCABULARY: "Chọn từ vựng phù hợp với ngữ cảnh và ý nghĩa của câu.",
    SPELLING: "Chú ý chính tả đúng của từ.",
    PLURAL_SINGULAR: "Quy tắc số nhiều: Thêm -s/-es cho danh từ số nhiều thông thường.",
    PRONOUN: "Quy tắc đại từ: Chọn đại từ phù hợp với chủ ngữ/tân ngữ.",
    ADJECTIVE_ADVERB: "Tính từ bổ nghĩa cho danh từ, trạng từ bổ nghĩa cho động từ/tính từ.",
    COMPARATIVE_SUPERLATIVE: "So sánh hơn dùng -er/more, so sánh nhất dùng -est/most.",
    MODAL_VERB: "Động từ khuyết thiếu (can, could, should, must...) + động từ nguyên mẫu.",
    PASSIVE_ACTIVE: "Câu bị động: be + V3/V-ed.",
    CONDITIONAL: "Câu điều kiện có cấu trúc riêng cho từng loại (type 1, 2, 3).",
    OTHER: "Kiểm tra lại cấu trúc và ý nghĩa của câu.",
  };

  return rules[mistakeType];
}

/**
 * Lấy ví dụ minh họa
 */
function getExamples(mistakeType: MistakeType): string[] {
  const examples: Record<MistakeType, string[]> = {
    ARTICLE: [
      "I have a cat. (không xác định)",
      "The cat is sleeping. (xác định)",
      "She is an engineer. (nghề nghiệp)",
    ],
    PREPOSITION: [
      "I'm good at English.",
      "She depends on her parents.",
      "We arrived at the station.",
    ],
    TENSE: [
      "I am studying now. (hiện tại tiếp diễn)",
      "I studied yesterday. (quá khứ đơn)",
      "I will study tomorrow. (tương lai đơn)",
    ],
    SUBJECT_VERB_AGREEMENT: [
      "He is a student. (số ít)",
      "They are students. (số nhiều)",
      "She does her homework. (số ít)",
    ],
    WORD_ORDER: [
      "I eat an apple. (S + V + O)",
      "She speaks English fluently. (S + V + O + Adv)",
      "They live in Vietnam. (S + V + Prep phrase)",
    ],
    VOCABULARY: [
      "I want to learn English. (không phải 'study')",
      "She is wearing a dress. (không phải 'putting on')",
    ],
    SPELLING: ["receive (không phải recieve)", "separate (không phải seperate)"],
    PLURAL_SINGULAR: ["one book → two books", "one child → two children"],
    PRONOUN: ["He is my brother. (chủ ngữ)", "I love him. (tân ngữ)"],
    ADJECTIVE_ADVERB: [
      "She is beautiful. (tính từ)",
      "She sings beautifully. (trạng từ)",
    ],
    COMPARATIVE_SUPERLATIVE: [
      "bigger than (so sánh hơn)",
      "the biggest (so sánh nhất)",
    ],
    MODAL_VERB: ["I can swim.", "You should study.", "We must go."],
    PASSIVE_ACTIVE: ["The book is written by John. (bị động)"],
    CONDITIONAL: ["If I study, I will pass. (điều kiện loại 1)"],
    OTHER: ["Hãy kiểm tra lại cấu trúc câu."],
  };

  return examples[mistakeType] || [];
}

/**
 * Lấy các đáp án thay thế
 */
function getAlternatives(correctAnswer: string): string[] {
  // Có thể mở rộng để tạo các biến thể đúng khác
  return [correctAnswer];
}

/**
 * Lấy lỗi thường gặp cho người Việt
 */
function getCommonMistakeForVietnamese(mistakeType: MistakeType): string {
  const commonMistakes: Record<MistakeType, string> = {
    ARTICLE: "Người Việt thường quên mạo từ vì tiếng Việt không có mạo từ.",
    PREPOSITION: "Giới từ tiếng Anh khác tiếng Việt, cần học thuộc các cụm từ cố định.",
    TENSE: "Tiếng Việt không chia động từ theo thì, nên dễ nhầm lẫn.",
    SUBJECT_VERB_AGREEMENT: "Tiếng Việt không chia động từ theo ngôi, cần chú ý quy tắc này.",
    WORD_ORDER: "Trật tự từ tiếng Anh khác tiếng Việt, đặc biệt là vị trí tính từ.",
    VOCABULARY: "Dễ chọn sai từ do nghĩa tương tự hoặc dịch sát tiếng Việt.",
    SPELLING: "Chú ý các từ có chính tả khó hoặc khác phát âm.",
    PLURAL_SINGULAR: "Tiếng Việt không chia số nhiều như tiếng Anh.",
    PRONOUN: "Hệ thống đại từ tiếng Anh đơn giản hơn tiếng Việt.",
    ADJECTIVE_ADVERB: "Dễ nhầm lẫn giữa tính từ và trạng từ.",
    COMPARATIVE_SUPERLATIVE: "Cấu trúc so sánh khác tiếng Việt.",
    MODAL_VERB: "Động từ khuyết thiếu có cách dùng đặc biệt.",
    PASSIVE_ACTIVE: "Câu bị động tiếng Anh có cấu trúc riêng.",
    CONDITIONAL: "Câu điều kiện có nhiều loại với cấu trúc khác nhau.",
    OTHER: "Hãy chú ý đến cấu trúc và ngữ cảnh của câu.",
  };

  return commonMistakes[mistakeType] || "";
}

/**
 * Tạo giải thích chi tiết
 */
function generateExplanation(
  userAnswer: string,
  correctAnswer: string,
  mistakeType: MistakeType
): string {
  const explanations: Record<MistakeType, string> = {
    ARTICLE: `Bạn đã sử dụng sai mạo từ. Đáp án đúng là "${correctAnswer}". Hãy xem lại quy tắc sử dụng mạo từ a/an/the.`,
    PREPOSITION: `Giới từ bạn chọn chưa chính xác. Đáp án đúng là "${correctAnswer}". Mỗi động từ/tính từ thường đi với giới từ cố định.`,
    TENSE: `Thì bạn sử dụng chưa phù hợp. Đáp án đúng là "${correctAnswer}". Hãy chú ý đến thời gian và ngữ cảnh của câu.`,
    SUBJECT_VERB_AGREEMENT: `Chủ ngữ và động từ chưa hòa hợp. Đáp án đúng là "${correctAnswer}". Chủ ngữ số ít đi với động từ số ít.`,
    WORD_ORDER: `Trật tự từ chưa đúng. Đáp án đúng là "${correctAnswer}". Tiếng Anh thường theo cấu trúc S + V + O.`,
    VOCABULARY: `Từ vựng bạn chọn chưa phù hợp. Đáp án đúng là "${correctAnswer}". Hãy chú ý ngữ cảnh và ý nghĩa.`,
    SPELLING: `Chính tả chưa đúng. Đáp án đúng là "${correctAnswer}".`,
    PLURAL_SINGULAR: `Bạn nhầm lẫn giữa số ít và số nhiều. Đáp án đúng là "${correctAnswer}".`,
    PRONOUN: `Đại từ chưa phù hợp. Đáp án đúng là "${correctAnswer}".`,
    ADJECTIVE_ADVERB: `Bạn nhầm lẫn giữa tính từ và trạng từ. Đáp án đúng là "${correctAnswer}".`,
    COMPARATIVE_SUPERLATIVE: `Cấu trúc so sánh chưa đúng. Đáp án đúng là "${correctAnswer}".`,
    MODAL_VERB: `Động từ khuyết thiếu sử dụng chưa chính xác. Đáp án đúng là "${correctAnswer}".`,
    PASSIVE_ACTIVE: `Cấu trúc câu bị động/chủ động chưa đúng. Đáp án đúng là "${correctAnswer}".`,
    CONDITIONAL: `Câu điều kiện chưa chính xác. Đáp án đúng là "${correctAnswer}".`,
    OTHER: `Đáp án của bạn chưa chính xác. Đáp án đúng là "${correctAnswer}".`,
  };

  return explanations[mistakeType];
}

/**
 * Tạo lời động viên dựa trên lịch sử lỗi
 */
function generateEncouragement(
  mistakeType: MistakeType,
  userMistakeHistory?: MistakeType[]
): string {
  if (!userMistakeHistory || userMistakeHistory.length === 0) {
    return "Đừng lo lắng! Mọi người đều mắc lỗi khi học. Hãy thử lại nhé!";
  }

  const recentMistakes = userMistakeHistory.slice(-5);
  const repeatedMistakes = recentMistakes.filter((m) => m === mistakeType).length;

  if (repeatedMistakes >= 3) {
    return `Bạn đang gặp khó khăn với ${getMistakeTypeName(mistakeType)}. Đừng nản chí! Hãy xem lại lý thuyết và làm thêm bài tập nhé.`;
  } else if (repeatedMistakes >= 2) {
    return `${getMistakeTypeName(mistakeType)} có vẻ khó với bạn. Hãy chú ý kỹ hơn vào phần này!`;
  }

  return "Không sao! Hãy học từ sai lầm và tiếp tục phát huy nhé!";
}

/**
 * Lấy tên loại lỗi bằng tiếng Việt
 */
function getMistakeTypeName(mistakeType: MistakeType): string {
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
    OTHER: "lỗi này",
  };

  return names[mistakeType];
}

/**
 * Tạo gợi ý thích ứng dựa trên lịch sử lỗi
 */
export function generateAdaptiveHints(
  question: string,
  correctAnswer: string,
  userMistakeHistory: string[],
  attemptCount: number
): AdaptiveHint[] {
  const hints: AdaptiveHint[] = [];

  // Gợi ý mức 1: Mẹo ngữ pháp (hiển thị sau lần thử đầu tiên)
  if (attemptCount >= 1) {
    const recentMistakes = userMistakeHistory.slice(-5);
    const mostCommonMistake = getMostCommonMistake(recentMistakes);

    if (mostCommonMistake) {
      hints.push({
        level: "grammar_tip",
        content: `💡 Mẹo: ${getGrammarRule(mostCommonMistake as MistakeType)}`,
        showNow: true,
      });
    }
  }

  // Gợi ý mức 2: Ví dụ (hiển thị sau 2 lần thử)
  if (attemptCount >= 2) {
    const examples = getContextualExamples(question, correctAnswer);
    hints.push({
      level: "example",
      content: `📚 Ví dụ tương tự: ${examples[0]}`,
      showNow: true,
    });
  }

  // Gợi ý mức 3: Một phần đáp án (hiển thị sau 3 lần thử)
  if (attemptCount >= 3) {
    const partialAnswer = getPartialAnswer(correctAnswer);
    hints.push({
      level: "partial_answer",
      content: `🔍 Gợi ý: Đáp án bắt đầu bằng "${partialAnswer}"`,
      showNow: true,
    });
  }

  return hints;
}

/**
 * Lấy loại lỗi phổ biến nhất
 */
function getMostCommonMistake(mistakes: string[]): string | null {
  if (mistakes.length === 0) return null;

  const frequency: Record<string, number> = {};
  mistakes.forEach((mistake) => {
    frequency[mistake] = (frequency[mistake] || 0) + 1;
  });

  let maxCount = 0;
  let mostCommon: MistakeType | null = null;

  Object.entries(frequency).forEach(([mistake, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = mistake as MistakeType;
    }
  });

  return mostCommon;
}

/**
 * Lấy ví dụ theo ngữ cảnh
 */
function getContextualExamples(question: string, correctAnswer: string): string[] {
  // Phân tích câu hỏi và tạo ví dụ tương tự
  // Đây là phiên bản đơn giản, có thể mở rộng với NLP
  return [
    `Câu tương tự: "${correctAnswer}"`,
    "Hãy chú ý đến cấu trúc và từ vựng.",
  ];
}

/**
 * Lấy một phần đáp án
 */
function getPartialAnswer(correctAnswer: string): string {
  const words = correctAnswer.split(" ");
  if (words.length <= 2) {
    return correctAnswer.substring(0, 2) + "...";
  }
  return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "...";
}

/**
 * Tính toán mức độ nghiêm trọng của lỗi
 */
export function calculateSeverity(
  mistakeType: MistakeType,
  mistakeCount: number
): number {
  // Mức độ căn bản của từng loại lỗi (1-3)
  const baseSeverity: Record<MistakeType, number> = {
    ARTICLE: 2,
    PREPOSITION: 2,
    TENSE: 3,
    SUBJECT_VERB_AGREEMENT: 3,
    WORD_ORDER: 3,
    VOCABULARY: 2,
    SPELLING: 1,
    PLURAL_SINGULAR: 2,
    PRONOUN: 2,
    ADJECTIVE_ADVERB: 2,
    COMPARATIVE_SUPERLATIVE: 2,
    MODAL_VERB: 3,
    PASSIVE_ACTIVE: 3,
    CONDITIONAL: 3,
    OTHER: 1,
  };

  // Tăng mức độ nghiêm trọng theo số lần lặp lại
  const base = baseSeverity[mistakeType];
  if (mistakeCount >= 10) return 5;
  if (mistakeCount >= 7) return Math.min(base + 2, 5);
  if (mistakeCount >= 4) return Math.min(base + 1, 5);

  return base;
}
