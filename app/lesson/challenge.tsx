import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

import { Card } from "./card";
import { TranslationChallenge } from "./translation-challenge";
import { FillInBlankChallenge } from "./fill-in-blank-challenge";
import { WordOrderChallenge } from "./word-order-challenge";
import { MatchingPairsChallenge } from "./matching-pairs-challenge";

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
  question: string;
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
  question,
}: ChallengeProps) => {
  // For TRANSLATION and REVERSE_TRANSLATION types
  if (type === "TRANSLATION" || type === "REVERSE_TRANSLATION") {
    const correctAnswer = options.find((o) => o.correct)?.text || "";
    
    return (
      <TranslationChallenge
        question={question}
        correctAnswer={correctAnswer}
        onAnswer={(answer) => {
          const correctOption = options.find((o) => o.correct);
          if (correctOption) {
            onSelect(correctOption.id);
          }
        }}
        status={status}
        disabled={disabled}
      />
    );
  }

  // For FILL_IN_BLANK type
  if (type === "FILL_IN_BLANK") {
    // Assuming the question contains the sentence and blank position is marked
    const correctAnswer = options.find((o) => o.correct)?.text || "";
    const allOptions = options.map((o) => o.text);
    
    return (
      <FillInBlankChallenge
        sentence={question}
        blankPosition={0} // You may want to parse this from the question
        options={allOptions}
        correctAnswer={correctAnswer}
        onAnswer={(answer) => {
          const selectedOpt = options.find((o) => o.text === answer);
          if (selectedOpt) {
            onSelect(selectedOpt.id);
          }
        }}
        status={status}
        disabled={disabled}
      />
    );
  }

  // For WORD_ORDER type
  if (type === "WORD_ORDER") {
    const correctOrder = options.find((o) => o.correct)?.text || "";
    const words = question.split(" ");
    
    return (
      <WordOrderChallenge
        words={words}
        correctOrder={correctOrder}
        onAnswer={(answer) => {
          const correctOption = options.find((o) => o.correct);
          if (correctOption) {
            onSelect(correctOption.id);
          }
        }}
        status={status}
        disabled={disabled}
      />
    );
  }

  // For MATCHING_PAIRS type
  if (type === "MATCHING_PAIRS") {
    // Pairs should be stored in options with specific format
    const pairs = options.map((opt, idx) => ({
      id: opt.id,
      left: opt.text.split("|")[0] || "",
      right: opt.text.split("|")[1] || "",
    }));
    
    return (
      <MatchingPairsChallenge
        pairs={pairs}
        onAnswer={(matches) => {
          // Validate all matches are correct
          const allCorrect = Object.entries(matches).every(([leftId, rightId]) => {
            return Number(leftId) === Number(rightId);
          });
          
          if (allCorrect && options[0]) {
            onSelect(options[0].id);
          }
        }}
        status={status}
        disabled={disabled}
      />
    );
  }

  // Default behavior for SELECT and ASSIST types
  return (
    <div
      className={cn(
        "grid gap-2",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" &&
          "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      )}
    >
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          text={option.text}
          imageSrc={option.imageSrc}
          shortcut={`${i + 1}`}
          selected={selectedOption === option.id}
          onClick={() => onSelect(option.id)}
          status={status}
          audioSrc={option.audioSrc}
          disabled={disabled}
          type={type}
        />
      ))}
    </div>
  );
};
