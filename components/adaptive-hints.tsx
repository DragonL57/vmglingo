"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

type HintLevel = "grammar_tip" | "example" | "partial_answer";

interface AdaptiveHint {
  level: HintLevel;
  content: string;
  showNow: boolean;
}

interface AdaptiveHintsProps {
  hints: AdaptiveHint[];
  onHintShown?: (level: HintLevel) => void;
}

export const AdaptiveHints = ({ hints, onHintShown }: AdaptiveHintsProps) => {
  const [shownHints, setShownHints] = useState<Set<HintLevel>>(new Set());
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    // Reset khi hints thay đổi
    setShownHints(new Set());
    setCurrentHintIndex(0);
  }, [hints]);

  const showableHints = hints.filter((hint) => hint.showNow);
  const currentHint = showableHints[currentHintIndex];

  const handleShowHint = () => {
    if (currentHint && !shownHints.has(currentHint.level)) {
      setShownHints((prev) => new Set(prev).add(currentHint.level));
      onHintShown?.(currentHint.level);

      // Chuyển sang hint tiếp theo nếu có
      if (currentHintIndex < showableHints.length - 1) {
        setTimeout(() => {
          setCurrentHintIndex((prev) => prev + 1);
        }, 500);
      }
    }
  };

  const getHintIcon = (level: HintLevel) => {
    switch (level) {
      case "grammar_tip":
        return "💡";
      case "example":
        return "📚";
      case "partial_answer":
        return "🔍";
      default:
        return "💭";
    }
  };

  const getHintTitle = (level: HintLevel) => {
    switch (level) {
      case "grammar_tip":
        return "Mẹo ngữ pháp";
      case "example":
        return "Ví dụ tương tự";
      case "partial_answer":
        return "Gợi ý đáp án";
      default:
        return "Gợi ý";
    }
  };

  const getHintColor = (level: HintLevel) => {
    switch (level) {
      case "grammar_tip":
        return "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100";
      case "example":
        return "bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100";
      case "partial_answer":
        return "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100";
      default:
        return "bg-gray-50 dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100";
    }
  };

  if (!showableHints.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Các gợi ý đã hiển thị */}
      {Array.from(shownHints).map((level) => {
        const hint = hints.find((h) => h.level === level);
        if (!hint) return null;

        return (
          <div
            key={level}
            className={`p-4 rounded-lg border-2 ${getHintColor(level)} animate-in slide-in-from-top-2 duration-300`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {getHintIcon(level)}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{getHintTitle(level)}</h4>
                <p className="text-sm leading-relaxed">{hint.content}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Nút hiển thị gợi ý tiếp theo */}
      {currentHint && !shownHints.has(currentHint.level) && (
        <div className="flex justify-center">
          <Button
            onClick={handleShowHint}
            variant="primaryOutline"
            className="gap-2 border-2 border-dashed hover:border-solid"
          >
            <span>{getHintIcon(currentHint.level)}</span>
            <span>Xem {getHintTitle(currentHint.level)}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

// Hook để quản lý adaptive hints
export const useAdaptiveHints = (
  question: string,
  correctAnswer: string,
  userMistakeHistory: string[],
  attemptCount: number
) => {
  const [hints, setHints] = useState<AdaptiveHint[]>([]);

  useEffect(() => {
    // Import dynamically để tránh lỗi server-side
    void import("@/lib/ai-feedback").then((module) => {
      const generatedHints = module.generateAdaptiveHints(
        question,
        correctAnswer,
        userMistakeHistory,
        attemptCount
      );
      setHints(generatedHints);
    });
  }, [question, correctAnswer, userMistakeHistory, attemptCount]);

  return hints;
};
