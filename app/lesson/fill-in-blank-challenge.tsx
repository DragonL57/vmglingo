"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FillInBlankChallengeProps = {
  sentence: string;
  blankPosition: number; // index of the word to blank out
  options: string[];
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const FillInBlankChallenge = ({
  sentence,
  blankPosition,
  options,
  correctAnswer,
  onAnswer,
  status,
  disabled,
}: FillInBlankChallengeProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const words = sentence.split(" ");
  const blankedWord = words[blankPosition];

  const handleSelect = (option: string) => {
    if (disabled || status !== "none") return;
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return (
    <div className="space-y-6">
      {/* Sentence with blank */}
      <div className="rounded-lg bg-blue-50 p-6">
        <p className="text-xl text-neutral-700">
          {words.map((word, index) => {
            if (index === blankPosition) {
              return (
                <span
                  key={index}
                  className={cn(
                    "inline-block min-w-[100px] border-b-4 border-dashed border-neutral-400 px-2 py-1 text-center font-bold",
                    selectedAnswer &&
                      "border-solid border-blue-500 bg-blue-100",
                    status === "correct" &&
                      "border-green-500 bg-green-100 text-green-700",
                    status === "wrong" && "border-red-500 bg-red-100 text-red-700"
                  )}
                >
                  {selectedAnswer || "____"}
                </span>
              );
            }
            return <span key={index}> {word} </span>;
          })}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={disabled || status !== "none"}
            className={cn(
              "rounded-lg border-2 border-neutral-300 p-4 text-lg font-semibold transition-all hover:border-blue-500 hover:bg-blue-50 active:scale-95",
              selectedAnswer === option &&
                status === "none" &&
                "border-blue-500 bg-blue-100",
              selectedAnswer === option &&
                status === "correct" &&
                "border-green-500 bg-green-100 text-green-700",
              selectedAnswer === option &&
                status === "wrong" &&
                "border-red-500 bg-red-100 text-red-700",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {status === "wrong" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <p className="font-semibold">Đáp án đúng: {correctAnswer}</p>
        </div>
      )}
    </div>
  );
};
