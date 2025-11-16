"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type WordOrderChallengeProps = {
  words: string[];
  correctOrder: string; // The correct sentence
  onAnswer: (answer: string) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const WordOrderChallenge = ({
  words,
  correctOrder,
  onAnswer,
  status,
  disabled,
}: WordOrderChallengeProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(words);

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (disabled || status !== "none") return;

    if (fromAvailable) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter((w, i) => 
        availableWords.indexOf(word) !== i || i !== availableWords.indexOf(word)
      ));
    } else {
      const index = selectedWords.indexOf(word);
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleSubmit = () => {
    if (selectedWords.length === words.length) {
      onAnswer(selectedWords.join(" "));
    }
  };

  useEffect(() => {
    if (selectedWords.length === words.length && status === "none") {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWords]);

  return (
    <div className="space-y-6">
      {/* Selected words area */}
      <div
        className={cn(
          "min-h-[80px] rounded-lg border-2 border-dashed border-neutral-300 p-4",
          selectedWords.length > 0 && "border-blue-500 bg-blue-50",
          status === "correct" && "border-green-500 bg-green-100",
          status === "wrong" && "border-red-500 bg-red-100"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {selectedWords.length === 0 ? (
            <p className="w-full text-center text-neutral-400">
              Chọn các từ bên dưới...
            </p>
          ) : (
            selectedWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleWordClick(word, false)}
                disabled={disabled || status !== "none"}
                className={cn(
                  "rounded-lg border-2 border-blue-500 bg-white px-4 py-2 text-lg font-semibold transition-all hover:bg-blue-100 active:scale-95",
                  status === "correct" && "border-green-500 bg-green-50",
                  status === "wrong" && "border-red-500 bg-red-50",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {word}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available words */}
      <div className="flex flex-wrap justify-center gap-2">
        {availableWords.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(word, true)}
            disabled={disabled || status !== "none"}
            className={cn(
              "rounded-lg border-2 border-neutral-300 bg-white px-4 py-2 text-lg font-semibold transition-all hover:border-blue-500 hover:bg-blue-50 active:scale-95",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {word}
          </button>
        ))}
      </div>

      {status === "wrong" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <p className="font-semibold">Đáp án đúng:</p>
          <p className="text-lg">{correctOrder}</p>
        </div>
      )}
    </div>
  );
};
