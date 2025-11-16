"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type MatchingPair = {
  id: number;
  left: string;
  right: string;
};

type MatchingPairsChallengeProps = {
  pairs: MatchingPair[];
  onAnswer: (matches: Record<number, number>) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const MatchingPairsChallenge = ({
  pairs,
  onAnswer,
  status,
  disabled,
}: MatchingPairsChallengeProps) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});

  const leftItems = pairs.map((p) => ({ id: p.id, text: p.left }));
  
  // Use useMemo to shuffle only once, not on every re-render
  const rightItems = useMemo(
    () =>
      pairs
        .map((p) => ({ id: p.id, text: p.right }))
        .sort(() => Math.random() - 0.5),
    [pairs]
  );

  const handleLeftClick = (id: number) => {
    if (disabled || status !== "none") return;
    if (matches[id] !== undefined) {
      // Remove match
      const newMatches = { ...matches };
      delete newMatches[id];
      setMatches(newMatches);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (id: number) => {
    if (disabled || status !== "none" || selectedLeft === null) return;

    const newMatches = { ...matches, [selectedLeft]: id };
    setMatches(newMatches);
    setSelectedLeft(null);

    // Check if all pairs are matched
    if (Object.keys(newMatches).length === pairs.length) {
      onAnswer(newMatches);
    }
  };

  const isRightMatched = (id: number) => {
    return Object.values(matches).includes(id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = matches[item.id] !== undefined;
            const isSelected = selectedLeft === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                disabled={disabled}
                className={cn(
                  "w-full rounded-lg border-2 p-4 text-left text-lg font-semibold transition-all hover:bg-blue-50 active:scale-95",
                  isSelected && "border-blue-500 bg-blue-100",
                  isMatched && "border-green-500 bg-green-50 text-green-700",
                  !isMatched &&
                    !isSelected &&
                    "border-neutral-300 bg-white hover:border-blue-300",
                  disabled && "cursor-not-allowed opacity-50",
                  status === "wrong" &&
                    isMatched &&
                    "border-red-500 bg-red-50 text-red-700"
                )}
              >
                <span className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && (
                    <span className="ml-2 text-sm text-green-600">✓</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = isRightMatched(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={disabled || selectedLeft === null || isMatched}
                className={cn(
                  "w-full rounded-lg border-2 p-4 text-left text-lg font-semibold transition-all hover:bg-blue-50 active:scale-95",
                  isMatched && "border-green-500 bg-green-50 text-green-700",
                  !isMatched &&
                    "border-neutral-300 bg-white hover:border-blue-300",
                  selectedLeft !== null &&
                    !isMatched &&
                    "border-blue-300 hover:border-blue-500",
                  disabled && "cursor-not-allowed opacity-50",
                  status === "wrong" &&
                    isMatched &&
                    "border-red-500 bg-red-50 text-red-700"
                )}
              >
                <span className="flex items-center justify-between">
                  <span>{item.text}</span>
                  {isMatched && (
                    <span className="ml-2 text-sm text-green-600">✓</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {status === "wrong" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <p className="font-semibold">Hãy thử lại!</p>
        </div>
      )}
    </div>
  );
};
