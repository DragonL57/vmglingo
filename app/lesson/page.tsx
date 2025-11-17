import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) return redirect("/learn");

  type LessonWithRelations = typeof lesson & {
    challenges: Array<{ completed: boolean }>;
    lessonTips?: Array<{ id: number; title: string; content: string }>;
    grammarNotes?: Array<{ id: number; title: string; explanation: string; examples: string }>;
  };

  const lessonWithRelations = lesson as LessonWithRelations;

  const initialPercentage =
    (lessonWithRelations.challenges.filter((challenge) => challenge.completed).length /
      lessonWithRelations.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id!}
      initialLessonChallenges={lessonWithRelations.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
      lessonTips={lessonWithRelations.lessonTips || []}
      grammarNotes={lessonWithRelations.grammarNotes?.map((note) => ({
        ...note,
        examples: JSON.parse(note.examples) as string[],
      })) || []}
    />
  );
};

export default LessonPage;
