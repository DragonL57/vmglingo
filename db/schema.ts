import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Unit 1
  description: text("description").notNull(), // Learn the basics of English
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
  lessonTips: many(lessonTips),
  grammarNotes: many(grammarNotes),
}));

export const lessonTips = pgTable("lesson_tips", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

export const lessonTipsRelations = relations(lessonTips, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonTips.lessonId],
    references: [lessons.id],
  }),
}));

export const grammarNotes = pgTable("grammar_notes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  explanation: text("explanation").notNull(),
  examples: text("examples").notNull(), // JSON array of example sentences
  order: integer("order").notNull(),
});

export const grammarNotesRelations = relations(grammarNotes, ({ one }) => ({
  lesson: one(lessons, {
    fields: [grammarNotes.lessonId],
    references: [lessons.id],
  }),
}));

export const challengesEnum = pgEnum("type", [
  "SELECT",
  "ASSIST",
  "TRANSLATION",
  "REVERSE_TRANSLATION",
  "FILL_IN_BLANK",
  "MATCHING_PAIRS",
  "WORD_ORDER",
]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(MAX_HEARTS),
  points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// Enum for mistake types
export const mistakeTypeEnum = pgEnum("mistake_type", [
  "ARTICLE", // Lỗi mạo từ (a, an, the)
  "PREPOSITION", // Lỗi giới từ
  "TENSE", // Lỗi thì
  "SUBJECT_VERB_AGREEMENT", // Lỗi sự hòa hợp chủ ngữ động từ
  "WORD_ORDER", // Lỗi trật tự từ
  "VOCABULARY", // Lỗi từ vựng
  "SPELLING", // Lỗi chính tả
  "PLURAL_SINGULAR", // Lỗi số ít/số nhiều
  "PRONOUN", // Lỗi đại từ
  "ADJECTIVE_ADVERB", // Lỗi tính từ/trạng từ
  "COMPARATIVE_SUPERLATIVE", // Lỗi so sánh hơn/nhất
  "MODAL_VERB", // Lỗi động từ khuyết thiếu
  "PASSIVE_ACTIVE", // Lỗi câu chủ động/bị động
  "CONDITIONAL", // Lỗi câu điều kiện
  "OTHER", // Lỗi khác
]);

// User mistakes tracking - theo dõi lỗi của người dùng
export const userMistakes = pgTable("user_mistakes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  mistakeType: mistakeTypeEnum("mistake_type").notNull(),
  userAnswer: text("user_answer").notNull(), // Đáp án sai của người dùng
  correctAnswer: text("correct_answer").notNull(), // Đáp án đúng
  explanation: text("explanation"), // Giải thích lỗi
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const userMistakesRelations = relations(userMistakes, ({ one }) => ({
  challenge: one(challenges, {
    fields: [userMistakes.challengeId],
    references: [challenges.id],
  }),
}));

// Grammar weaknesses - điểm yếu ngữ pháp
export const grammarWeaknesses = pgTable("grammar_weaknesses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  mistakeType: mistakeTypeEnum("mistake_type").notNull(),
  count: integer("count").notNull().default(1), // Số lần mắc lỗi
  lastOccurrence: timestamp("last_occurrence").notNull().defaultNow(),
  severity: integer("severity").notNull().default(1), // Mức độ nghiêm trọng (1-5)
});

export const grammarWeaknessesRelations = relations(
  grammarWeaknesses,
  ({ one }) => ({
    // Relations nếu cần
  })
);

// Confusing words - các từ dễ gây nhầm lẫn
export const confusingWords = pgTable("confusing_words", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  word1: text("word_1").notNull(), // Từ thứ nhất (VD: "affect")
  word2: text("word_2").notNull(), // Từ thứ hai (VD: "effect")
  mistakeCount: integer("mistake_count").notNull().default(1),
  lastMistake: timestamp("last_mistake").notNull().defaultNow(),
  explanation: text("explanation"), // Giải thích sự khác biệt
});

export const confusingWordsRelations = relations(confusingWords, ({ one }) => ({
  // Relations nếu cần
}));

// AI feedback history - lịch sử phản hồi AI
export const aiFeedbackHistory = pgTable("ai_feedback_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  feedbackType: text("feedback_type").notNull(), // "explanation", "hint", "encouragement"
  content: text("content").notNull(), // Nội dung phản hồi
  wasHelpful: boolean("was_helpful"), // Người dùng có thấy hữu ích không
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const aiFeedbackHistoryRelations = relations(
  aiFeedbackHistory,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [aiFeedbackHistory.challengeId],
      references: [challenges.id],
    }),
  })
);
