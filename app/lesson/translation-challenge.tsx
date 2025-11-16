"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type TranslationChallengeProps = {
  question: string;
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const TranslationChallenge = ({
  question,
  correctAnswer,
  onAnswer,
  status,
  disabled,
}: TranslationChallengeProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && input.trim()) {
      onAnswer(input.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-lg font-semibold text-neutral-700">{question}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || status !== "none"}
          placeholder="Nhập câu trả lời của bạn..."
          className={cn(
            "w-full rounded-lg border-2 border-neutral-300 p-4 text-lg outline-none transition-colors focus:border-blue-500",
            status === "correct" && "border-green-500 bg-green-50",
            status === "wrong" && "border-red-500 bg-red-50",
            disabled && "cursor-not-allowed opacity-50"
          )}
          autoFocus
        />

        {status === "wrong" && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <p className="font-semibold">Đáp án đúng:</p>
            <p>{correctAnswer}</p>
          </div>
        )}
      </form>
    </div>
  );
};
