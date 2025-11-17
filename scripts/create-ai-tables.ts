import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

const main = async () => {
  try {
    console.log("Creating AI feedback tables...");

    // Create enum type if not exists
    await sql`
      DO $$ BEGIN
        CREATE TYPE mistake_type AS ENUM(
          'ARTICLE', 'PREPOSITION', 'TENSE', 'SUBJECT_VERB_AGREEMENT', 
          'WORD_ORDER', 'VOCABULARY', 'SPELLING', 'PLURAL_SINGULAR', 
          'PRONOUN', 'ADJECTIVE_ADVERB', 'COMPARATIVE_SUPERLATIVE', 
          'MODAL_VERB', 'PASSIVE_ACTIVE', 'CONDITIONAL', 'OTHER'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create user_mistakes table
    await sql`
      CREATE TABLE IF NOT EXISTS user_mistakes (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        mistake_type mistake_type NOT NULL,
        user_answer TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Create grammar_weaknesses table
    await sql`
      CREATE TABLE IF NOT EXISTS grammar_weaknesses (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        mistake_type mistake_type NOT NULL,
        count INTEGER DEFAULT 1 NOT NULL,
        last_occurrence TIMESTAMP DEFAULT NOW() NOT NULL,
        severity INTEGER DEFAULT 1 NOT NULL
      );
    `;

    // Create confusing_words table
    await sql`
      CREATE TABLE IF NOT EXISTS confusing_words (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        word_1 TEXT NOT NULL,
        word_2 TEXT NOT NULL,
        mistake_count INTEGER DEFAULT 1 NOT NULL,
        last_mistake TIMESTAMP DEFAULT NOW() NOT NULL,
        explanation TEXT
      );
    `;

    // Create ai_feedback_history table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_feedback_history (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        challenge_id INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        feedback_type TEXT NOT NULL,
        content TEXT NOT NULL,
        was_helpful BOOLEAN,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log("✅ AI feedback tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  }

  process.exit(0);
};

main();
