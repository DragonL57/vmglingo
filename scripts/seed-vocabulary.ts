import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding enhanced vocabulary database...");

    // Delete existing data
    await db.delete(schema.courses);

    // Insert course
    const [course] = await db
      .insert(schema.courses)
      .values([
        {
          title: "English",
          imageSrc: "/gb.svg",
        },
      ])
      .returning();

    // Unit 1: Greetings & Basics
    const [unit1] = await db
      .insert(schema.units)
      .values([
        {
          courseId: course.id,
          title: "Unit 1",
          description: "Lời chào & Cơ bản",
          order: 1,
        },
      ])
      .returning();

    const [lesson1] = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit1.id, title: "Greetings", order: 1 },
      ])
      .returning();

    await db.insert(schema.lessonTips).values([
      {
        lessonId: lesson1.id,
        title: "Tip: Cách chào hỏi",
        content: "Trong tiếng Anh, 'Hello' và 'Hi' đều có nghĩa là 'Xin chào'. 'Hello' trang trọng hơn 'Hi'.",
        order: 1,
      },
    ]);

    await db.insert(schema.grammarNotes).values([
      {
        lessonId: lesson1.id,
        title: "Động từ 'to be'",
        explanation: "Động từ 'to be' (am/is/are) được dùng để giới thiệu bản thân hoặc mô tả trạng thái.",
        examples: JSON.stringify([
          "I am Long. (Tôi là Long.)",
          "He is a student. (Anh ấy là học sinh.)",
          "They are happy. (Họ vui vẻ.)"
        ]),
        order: 1,
      },
    ]);

    // Lesson 1 Challenges
    await db.insert(schema.challenges).values([
      { lessonId: lesson1.id, type: "SELECT", question: "Hello", order: 1 },
      { lessonId: lesson1.id, type: "ASSIST", question: "Xin chào", order: 2 },
      { lessonId: lesson1.id, type: "SELECT", question: "Good morning", order: 3 },
      { lessonId: lesson1.id, type: "TRANSLATION", question: "Tạm biệt", order: 4 },
      { lessonId: lesson1.id, type: "SELECT", question: "How are you?", order: 5 },
    ]);

    const challenges1 = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson1.id),
    });

    await db.insert(schema.challengeOptions).values([
      // Challenge 1: Hello
      { challengeId: challenges1[0].id, text: "Xin chào", correct: true },
      { challengeId: challenges1[0].id, text: "Tạm biệt", correct: false },
      { challengeId: challenges1[0].id, text: "Cảm ơn", correct: false },
      
      // Challenge 2: Xin chào
      { challengeId: challenges1[1].id, text: "Hello", correct: true },
      { challengeId: challenges1[1].id, text: "Goodbye", correct: false },
      { challengeId: challenges1[1].id, text: "Thank you", correct: false },
      
      // Challenge 3: Good morning
      { challengeId: challenges1[2].id, text: "Chào buổi sáng", correct: true },
      { challengeId: challenges1[2].id, text: "Chào buổi chiều", correct: false },
      { challengeId: challenges1[2].id, text: "Chúc ngủ ngon", correct: false },
      
      // Challenge 4: Tạm biệt (TRANSLATION)
      { challengeId: challenges1[3].id, text: "Goodbye", correct: true },
      
      // Challenge 5: How are you?
      { challengeId: challenges1[4].id, text: "Bạn khỏe không?", correct: true },
      { challengeId: challenges1[4].id, text: "Bạn tên gì?", correct: false },
      { challengeId: challenges1[4].id, text: "Bạn đến từ đâu?", correct: false },
    ]);

    const [lesson2] = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit1.id, title: "Introduction", order: 2 },
      ])
      .returning();

    await db.insert(schema.lessonTips).values([
      {
        lessonId: lesson2.id,
        title: "Tip: Giới thiệu bản thân",
        content: "Khi giới thiệu tên, dùng 'My name is...' hoặc 'I am...'",
        order: 1,
      },
    ]);

    await db.insert(schema.challenges).values([
      { lessonId: lesson2.id, type: "SELECT", question: "My name is...", order: 1 },
      { lessonId: lesson2.id, type: "TRANSLATION", question: "Tôi là sinh viên", order: 2 },
      { lessonId: lesson2.id, type: "WORD_ORDER", question: "am I student a", order: 3 },
      { lessonId: lesson2.id, type: "SELECT", question: "Nice to meet you", order: 4 },
      { lessonId: lesson2.id, type: "FILL_IN_BLANK", question: "I ____ from Vietnam", order: 5 },
    ]);

    const challenges2 = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson2.id),
    });

    await db.insert(schema.challengeOptions).values([
      // Challenge 1: My name is...
      { challengeId: challenges2[0].id, text: "Tên tôi là...", correct: true },
      { challengeId: challenges2[0].id, text: "Bạn tên gì?", correct: false },
      { challengeId: challenges2[0].id, text: "Tôi đến từ...", correct: false },
      
      // Challenge 2: Tôi là sinh viên (TRANSLATION)
      { challengeId: challenges2[1].id, text: "I am a student", correct: true },
      
      // Challenge 3: WORD_ORDER
      { challengeId: challenges2[2].id, text: "I am a student", correct: true },
      
      // Challenge 4: Nice to meet you
      { challengeId: challenges2[3].id, text: "Rất vui được gặp bạn", correct: true },
      { challengeId: challenges2[3].id, text: "Hẹn gặp lại", correct: false },
      { challengeId: challenges2[3].id, text: "Cảm ơn bạn", correct: false },
      
      // Challenge 5: FILL_IN_BLANK
      { challengeId: challenges2[4].id, text: "am", correct: true },
      { challengeId: challenges2[4].id, text: "is", correct: false },
      { challengeId: challenges2[4].id, text: "are", correct: false },
    ]);

    // Unit 2: Food & Drinks
    const [unit2] = await db
      .insert(schema.units)
      .values([
        {
          courseId: course.id,
          title: "Unit 2",
          description: "Đồ ăn & Thức uống",
          order: 2,
        },
      ])
      .returning();

    const [lesson3] = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit2.id, title: "Food", order: 1 },
      ])
      .returning();

    await db.insert(schema.lessonTips).values([
      {
        lessonId: lesson3.id,
        title: "Tip: Từ vựng đồ ăn",
        content: "Danh từ đếm được (countable) như 'apple' có thể thêm 's' để tạo số nhiều. Danh từ không đếm được (uncountable) như 'rice' không thêm 's'.",
        order: 1,
      },
    ]);

    await db.insert(schema.grammarNotes).values([
      {
        lessonId: lesson3.id,
        title: "Danh từ đếm được và không đếm được",
        explanation: "Danh từ đếm được có thể đếm (1 apple, 2 apples). Danh từ không đếm được không thể đếm trực tiếp (rice, water).",
        examples: JSON.stringify([
          "I have an apple. (Tôi có một quả táo.)",
          "I like rice. (Tôi thích cơm.)",
          "Can I have some water? (Cho tôi xin ít nước?)"
        ]),
        order: 1,
      },
    ]);

    await db.insert(schema.challenges).values([
      { lessonId: lesson3.id, type: "SELECT", question: "Apple", order: 1 },
      { lessonId: lesson3.id, type: "SELECT", question: "Rice", order: 2 },
      { lessonId: lesson3.id, type: "TRANSLATION", question: "Tôi thích bánh mì", order: 3 },
      { lessonId: lesson3.id, type: "SELECT", question: "Chicken", order: 4 },
      { lessonId: lesson3.id, type: "MATCHING_PAIRS", question: "apple|táo banana|chuối orange|cam grape|nho", order: 5 },
    ]);

    const challenges3 = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson3.id),
    });

    await db.insert(schema.challengeOptions).values([
      // Challenge 1: Apple
      { challengeId: challenges3[0].id, text: "Táo", correct: true },
      { challengeId: challenges3[0].id, text: "Chuối", correct: false },
      { challengeId: challenges3[0].id, text: "Cam", correct: false },
      
      // Challenge 2: Rice
      { challengeId: challenges3[1].id, text: "Cơm", correct: true },
      { challengeId: challenges3[1].id, text: "Mì", correct: false },
      { challengeId: challenges3[1].id, text: "Bánh mì", correct: false },
      
      // Challenge 3: Translation
      { challengeId: challenges3[2].id, text: "I like bread", correct: true },
      
      // Challenge 4: Chicken
      { challengeId: challenges3[3].id, text: "Thịt gà", correct: true },
      { challengeId: challenges3[3].id, text: "Thịt bò", correct: false },
      { challengeId: challenges3[3].id, text: "Thịt heo", correct: false },
      
      // Challenge 5: MATCHING_PAIRS
      { challengeId: challenges3[4].id, text: "apple|táo", correct: true },
      { challengeId: challenges3[4].id, text: "banana|chuối", correct: true },
      { challengeId: challenges3[4].id, text: "orange|cam", correct: true },
      { challengeId: challenges3[4].id, text: "grape|nho", correct: true },
    ]);

    const [lesson4] = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit2.id, title: "Drinks", order: 2 },
      ])
      .returning();

    await db.insert(schema.lessonTips).values([
      {
        lessonId: lesson4.id,
        title: "Tip: Thức uống",
        content: "Khi gọi đồ uống, có thể dùng 'I would like...' hoặc 'Can I have...'",
        order: 1,
      },
    ]);

    await db.insert(schema.challenges).values([
      { lessonId: lesson4.id, type: "SELECT", question: "Water", order: 1 },
      { lessonId: lesson4.id, type: "SELECT", question: "Coffee", order: 2 },
      { lessonId: lesson4.id, type: "TRANSLATION", question: "Tôi muốn trà", order: 3 },
      { lessonId: lesson4.id, type: "FILL_IN_BLANK", question: "I would like some ____", order: 4 },
      { lessonId: lesson4.id, type: "SELECT", question: "Juice", order: 5 },
    ]);

    const challenges4 = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson4.id),
    });

    await db.insert(schema.challengeOptions).values([
      // Challenge 1: Water
      { challengeId: challenges4[0].id, text: "Nước", correct: true },
      { challengeId: challenges4[0].id, text: "Trà", correct: false },
      { challengeId: challenges4[0].id, text: "Cà phê", correct: false },
      
      // Challenge 2: Coffee
      { challengeId: challenges4[1].id, text: "Cà phê", correct: true },
      { challengeId: challenges4[1].id, text: "Trà", correct: false },
      { challengeId: challenges4[1].id, text: "Sữa", correct: false },
      
      // Challenge 3: Translation
      { challengeId: challenges4[2].id, text: "I want tea", correct: true },
      
      // Challenge 4: FILL_IN_BLANK
      { challengeId: challenges4[3].id, text: "water", correct: true },
      { challengeId: challenges4[3].id, text: "coffee", correct: false },
      { challengeId: challenges4[3].id, text: "juice", correct: false },
      
      // Challenge 5: Juice
      { challengeId: challenges4[4].id, text: "Nước ép", correct: true },
      { challengeId: challenges4[4].id, text: "Nước lọc", correct: false },
      { challengeId: challenges4[4].id, text: "Soda", correct: false },
    ]);

    // Unit 3: Family & Relationships
    const [unit3] = await db
      .insert(schema.units)
      .values([
        {
          courseId: course.id,
          title: "Unit 3",
          description: "Gia đình & Mối quan hệ",
          order: 3,
        },
      ])
      .returning();

    const [lesson5] = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit3.id, title: "Family Members", order: 1 },
      ])
      .returning();

    await db.insert(schema.lessonTips).values([
      {
        lessonId: lesson5.id,
        title: "Tip: Thành viên gia đình",
        content: "Các từ như 'mother', 'father' trang trọng. 'Mom', 'Dad' thân mật hơn.",
        order: 1,
      },
    ]);

    await db.insert(schema.grammarNotes).values([
      {
        lessonId: lesson5.id,
        title: "Tính từ sở hữu",
        explanation: "Tính từ sở hữu (my, your, his, her, our, their) được dùng trước danh từ để chỉ sự sở hữu.",
        examples: JSON.stringify([
          "My mother is a teacher. (Mẹ tôi là giáo viên.)",
          "His father works here. (Bố anh ấy làm việc ở đây.)",
          "Our family is big. (Gia đình chúng tôi đông.)"
        ]),
        order: 1,
      },
    ]);

    await db.insert(schema.challenges).values([
      { lessonId: lesson5.id, type: "SELECT", question: "Mother", order: 1 },
      { lessonId: lesson5.id, type: "SELECT", question: "Father", order: 2 },
      { lessonId: lesson5.id, type: "TRANSLATION", question: "Anh trai tôi", order: 3 },
      { lessonId: lesson5.id, type: "MATCHING_PAIRS", question: "mother|mẹ father|bố sister|chị/em gái brother|anh/em trai", order: 4 },
      { lessonId: lesson5.id, type: "WORD_ORDER", question: "is teacher my mother a", order: 5 },
    ]);

    const challenges5 = await db.query.challenges.findMany({
      where: (challenges, { eq }) => eq(challenges.lessonId, lesson5.id),
    });

    await db.insert(schema.challengeOptions).values([
      // Challenge 1: Mother
      { challengeId: challenges5[0].id, text: "Mẹ", correct: true },
      { challengeId: challenges5[0].id, text: "Bố", correct: false },
      { challengeId: challenges5[0].id, text: "Chị", correct: false },
      
      // Challenge 2: Father
      { challengeId: challenges5[1].id, text: "Bố", correct: true },
      { challengeId: challenges5[1].id, text: "Mẹ", correct: false },
      { challengeId: challenges5[1].id, text: "Anh", correct: false },
      
      // Challenge 3: Translation
      { challengeId: challenges5[2].id, text: "My brother", correct: true },
      
      // Challenge 4: MATCHING_PAIRS
      { challengeId: challenges5[3].id, text: "mother|mẹ", correct: true },
      { challengeId: challenges5[3].id, text: "father|bố", correct: true },
      { challengeId: challenges5[3].id, text: "sister|chị/em gái", correct: true },
      { challengeId: challenges5[3].id, text: "brother|anh/em trai", correct: true },
      
      // Challenge 5: WORD_ORDER
      { challengeId: challenges5[4].id, text: "My mother is a teacher", correct: true },
    ]);

    console.log("✅ Seeding vocabulary completed successfully!");
    console.log(`Created ${3} units with themed lessons`);
    console.log("Added lesson tips and grammar notes for each lesson");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
