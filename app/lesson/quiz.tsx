"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { getAIFeedback } from "@/actions/ai-feedback";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import {
  recordUserMistake,
  recordAIFeedback,
  getUserMistakeHistory,
} from "@/actions/mistake-tracking";
import { reduceHearts } from "@/actions/user-progress";
import { AdaptiveHints } from "@/components/adaptive-hints";
import { LessonTips } from "@/components/lesson-tips";
import { AIFeedbackModal } from "@/components/modals/ai-feedback-modal";
import { MAX_HEARTS } from "@/constants";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

type LessonTip = {
  id: number;
  title: string;
  content: string;
};

type GrammarNote = {
  id: number;
  title: string;
  explanation: string;
  examples: string[];
};

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
  lessonTips?: LessonTip[];
  grammarNotes?: GrammarNote[];
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
  lessonTips = [],
  grammarNotes = [],
}: QuizProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const { width, height } = useWindowSize();

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  // AI Feedback states
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    explanation: string;
    grammarRule?: string;
    examples?: string[];
    alternatives?: string[];
    mistakeType?: "ARTICLE" | "PREPOSITION" | "TENSE" | "SUBJECT_VERB_AGREEMENT" | "WORD_ORDER" | "VOCABULARY" | "SPELLING" | "PLURAL_SINGULAR" | "PRONOUN" | "ADJECTIVE_ADVERB" | "COMPARATIVE_SUPERLATIVE" | "MODAL_VERB" | "PASSIVE_ACTIVE" | "CONDITIONAL" | "OTHER";
    commonMistakeForVietnamese?: string;
    encouragement: string;
  } | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [mistakeHistory, setMistakeHistory] = useState<string[]>([]);

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  // Load user mistake history on mount
  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();

    getUserMistakeHistory(20)
      .then((history) => {
        const types = history.map((h: { mistakeType: string }) => h.mistakeType);
        setMistakeHistory(types);
      })
      .catch(console.error);
  });

  const onNext = () => {
    setActiveIndex((current) => current + 1);
    setAttemptCount(0); // Reset attempt count for new challenge
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) return;

    // Get user's answer text
    const selectedOptionData = options.find((opt) => opt.id === selectedOption);
    const answerText = selectedOptionData?.text || "";

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            void correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // Không hiển thị AI feedback khi đúng, chỉ log để tracking
            // Có thể record feedback nhẹ nhàng mà không hiển thị modal

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, MAX_HEARTS));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      setAttemptCount((prev) => prev + 1);

      startTransition(() => {
        reduceHearts(challenge.id)
          .then(async (response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            void incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));

            // Generate AI feedback for incorrect answer using Gemini
            const aiFeedbackResult = await getAIFeedback(
              answerText,
              correctOption.text,
              challenge.question,
              challenge.type,
              false,
              mistakeHistory as Array<"ARTICLE" | "PREPOSITION" | "TENSE" | "SUBJECT_VERB_AGREEMENT" | "WORD_ORDER" | "VOCABULARY" | "SPELLING" | "PLURAL_SINGULAR" | "PRONOUN" | "ADJECTIVE_ADVERB" | "COMPARATIVE_SUPERLATIVE" | "MODAL_VERB" | "PASSIVE_ACTIVE" | "CONDITIONAL" | "OTHER">
            );

            if (aiFeedbackResult.success && aiFeedbackResult.feedback) {
              const feedback = aiFeedbackResult.feedback;
              setFeedbackData(feedback);

              // Record mistake and feedback
              if (feedback.mistakeType) {
                recordUserMistake(
                  challenge.id,
                  feedback.mistakeType,
                  answerText,
                  correctOption.text,
                  feedback.explanation
                ).catch(console.error);

                recordAIFeedback(
                  challenge.id,
                  "explanation",
                  feedback.explanation
                ).catch(console.error);

                // Update local mistake history
                setMistakeHistory((prev) => [...prev, feedback.mistakeType!]);
              }

              // Show feedback modal
              setShowAIFeedback(true);
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />

          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />

          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>

          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={userSubscription?.isActive ? Infinity : hearts}
            />
          </div>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.type === "TRANSLATION"
        ? "Dịch câu sau sang tiếng Anh"
        : challenge.type === "REVERSE_TRANSLATION"
          ? "Dịch câu sau sang tiếng Việt"
          : challenge.type === "FILL_IN_BLANK"
            ? "Điền vào chỗ trống"
            : challenge.type === "WORD_ORDER"
              ? "Sắp xếp các từ để tạo thành câu"
              : challenge.type === "MATCHING_PAIRS"
                ? "Ghép các cặp từ tương ứng"
                : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0 mt-0 lg:mt-8">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>

            {/* Show tips before first challenge */}
            {activeIndex === 0 && (lessonTips.length > 0 || grammarNotes.length > 0) && (
              <LessonTips
                tips={lessonTips}
                grammarNotes={grammarNotes}
                compact
              />
            )}

            {/* Adaptive Hints - show after wrong attempts */}
            {status === "wrong" && attemptCount > 0 && (
              <AdaptiveHints
                hints={[]}
                onHintShown={(level) => {
                  recordAIFeedback(
                    challenge.id,
                    "hint",
                    `Hint level: ${level}`
                  ).catch(console.error);
                }}
              />
            )}

            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}

              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
                question={challenge.question}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback Modal */}
      {feedbackData && (
        <AIFeedbackModal
          isOpen={showAIFeedback}
          onClose={() => setShowAIFeedback(false)}
          isCorrect={status === "correct"}
          explanation={feedbackData.explanation}
          grammarRule={feedbackData.grammarRule}
          examples={feedbackData.examples}
          alternatives={feedbackData.alternatives}
          mistakeType={feedbackData.mistakeType}
          commonMistakeForVietnamese={feedbackData.commonMistakeForVietnamese}
          encouragement={feedbackData.encouragement}
        />
      )}

      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />

      {/* AI Feedback Modal */}
      {feedbackData && (
        <AIFeedbackModal
          isOpen={showAIFeedback}
          onClose={() => setShowAIFeedback(false)}
          isCorrect={status === "correct"}
          explanation={feedbackData.explanation}
          grammarRule={feedbackData.grammarRule}
          examples={feedbackData.examples}
          alternatives={feedbackData.alternatives}
          mistakeType={feedbackData.mistakeType}
          commonMistakeForVietnamese={feedbackData.commonMistakeForVietnamese}
          encouragement={feedbackData.encouragement}
        />
      )}
    </>
  );
};
