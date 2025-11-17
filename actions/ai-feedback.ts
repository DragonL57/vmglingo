"use server";

import { generateAIFeedback, generateAdaptiveHint } from "@/lib/gemini";

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

/**
 * Tạo AI feedback sử dụng Gemini
 */
export const getAIFeedback = async (
  userAnswer: string,
  correctAnswer: string,
  question: string,
  challengeType: ChallengeType,
  isCorrect: boolean,
  userMistakeHistory?: MistakeType[]
) => {
  try {
    const feedback = await generateAIFeedback(
      userAnswer,
      correctAnswer,
      question,
      challengeType,
      isCorrect,
      userMistakeHistory
    );

    return { success: true, feedback };
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    return {
      success: false,
      error: "Failed to generate AI feedback",
    };
  }
};

/**
 * Tạo gợi ý thích ứng
 */
export const getAdaptiveHint = async (
  question: string,
  correctAnswer: string,
  userMistakeHistory: MistakeType[],
  attemptCount: number,
  hintLevel: "grammar_tip" | "example" | "partial_answer"
) => {
  try {
    const hint = await generateAdaptiveHint(
      question,
      correctAnswer,
      userMistakeHistory,
      attemptCount,
      hintLevel
    );

    return { success: true, hint };
  } catch (error) {
    console.error("Error getting adaptive hint:", error);
    return {
      success: false,
      error: "Failed to generate hint",
    };
  }
};
