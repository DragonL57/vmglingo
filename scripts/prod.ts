import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values([{ title: "Tiếng Anh", imageSrc: "/gb.svg" }])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Đơn vị 1",
            description: `Học những kiến thức cơ bản về ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Đơn vị 2",
            description: `Học ${course.title} trình độ trung cấp`,
            order: 2,
          },
        ])
        .returning();

      // For each unit, insert lessons
      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Danh từ", order: 1 },
            { unitId: unit.id, title: "Động từ", order: 2 },
            { unitId: unit.id, title: "Tính từ", order: 3 },
            { unitId: unit.id, title: "Cụm từ", order: 4 },
            { unitId: unit.id, title: "Câu", order: 5 },
          ])
          .returning();

        // For each lesson, insert challenges
        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "đàn ông"?',
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "phụ nữ"?',
                order: 2,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "bé trai"?',
                order: 3,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"đàn ông"',
                order: 4,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "zombie"?',
                order: 5,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "người máy"?',
                order: 6,
              },
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: 'Từ nào trong số này có nghĩa là "bé gái"?',
                order: 7,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: '"zombie"',
                order: 8,
              },
            ])
            .returning();

          // For each challenge, insert challenge options
          for (const challenge of challenges) {
            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "man",
                  imageSrc: "/man.svg",
                  audioSrc: "/en_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "woman",
                  imageSrc: "/woman.svg",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "boy",
                  imageSrc: "/boy.svg",
                  audioSrc: "/en_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 2) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "woman",
                  imageSrc: "/woman.svg",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "boy",
                  imageSrc: "/boy.svg",
                  audioSrc: "/en_boy.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "man",
                  imageSrc: "/man.svg",
                  audioSrc: "/en_man.mp3",
                },
              ]);
            }

            if (challenge.order === 3) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "woman",
                  imageSrc: "/woman.svg",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "man",
                  imageSrc: "/man.svg",
                  audioSrc: "/en_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "boy",
                  imageSrc: "/boy.svg",
                  audioSrc: "/en_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 4) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "woman",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "man",
                  audioSrc: "/en_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "boy",
                  audioSrc: "/en_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 5) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "man",
                  imageSrc: "/man.svg",
                  audioSrc: "/en_man.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "woman",
                  imageSrc: "/woman.svg",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/en_zombie.mp3",
                },
              ]);
            }

            if (challenge.order === 6) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "robot",
                  imageSrc: "/robot.svg",
                  audioSrc: "/en_robot.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/en_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "boy",
                  imageSrc: "/boy.svg",
                  audioSrc: "/en_boy.mp3",
                },
              ]);
            }

            if (challenge.order === 7) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "girl",
                  imageSrc: "/girl.svg",
                  audioSrc: "/en_girl.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "zombie",
                  imageSrc: "/zombie.svg",
                  audioSrc: "/en_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "man",
                  imageSrc: "/man.svg",
                  audioSrc: "/en_man.mp3",
                },
              ]);
            }

            if (challenge.order === 8) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "woman",
                  audioSrc: "/en_woman.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "zombie",
                  audioSrc: "/en_zombie.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "boy",
                  audioSrc: "/en_boy.mp3",
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
