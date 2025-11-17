import { redirect } from "next/navigation";

import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { Quiz } from "../quiz";

type LessonIdPageProps = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const lessonPromise = getLesson(params.lessonId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonPromise,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) return redirect("/learn");

  type LessonWithRelations = typeof lesson & {
    challenges: Array<{ completed: boolean }>;
    lessonTips?: Array<{ id: number; title: string; content: string }>;
    grammarNotes?: Array<{ id: number; title: string; explanation: string; examples: string }>;
  };

  const lessonData = lesson as LessonWithRelations;

  const initialPercentage =
    (lessonData.challenges.filter((challenge) => challenge.completed).length /
      lessonData.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id!}
      initialLessonChallenges={lessonData.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
      lessonTips={lessonData.lessonTips || []}
      grammarNotes={lessonData.grammarNotes?.map((note) => ({
        ...note,
        examples: JSON.parse(note.examples) as string[],
      })) || []}
    />
  );
};

export default LessonIdPage;
