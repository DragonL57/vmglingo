"use client";

import { useState } from "react";
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
  const [matchNumber, setMatchNumber] = useState<Record<number, number>>({});

  const leftItems = pairs.map((p) => ({ id: p.id, text: p.left }));
  
  // Keep right items in original order, don't shuffle
  const rightItems = pairs.map((p) => ({ id: p.id, text: p.right }));

  const handleLeftClick = (id: number) => {
    if (disabled || status !== "none") return;
    if (matches[id] !== undefined) {
      // Remove match and its number
      const newMatches = { ...matches };
      const newMatchNumber = { ...matchNumber };
      delete newMatches[id];
      delete newMatchNumber[id];
      setMatches(newMatches);
      setMatchNumber(newMatchNumber);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (id: number) => {
    if (disabled || status !== "none" || selectedLeft === null) return;

    const newMatches = { ...matches, [selectedLeft]: id };
    const currentNumber = Object.keys(matchNumber).length + 1;
    const newMatchNumber = { ...matchNumber, [selectedLeft]: currentNumber };
    
    setMatches(newMatches);
    setMatchNumber(newMatchNumber);
    setSelectedLeft(null);

    // Check if all pairs are matched
    if (Object.keys(newMatches).length === pairs.length) {
      onAnswer(newMatches);
    }
  };

  const isRightMatched = (id: number) => {
    return Object.values(matches).includes(id);
  };

  const getMatchNumberForRight = (rightId: number) => {
    const leftId = Object.keys(matches).find(
      (key) => matches[parseInt(key)] === rightId
    );
    return leftId ? matchNumber[parseInt(leftId)] : null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = matches[item.id] !== undefined;
            const isSelected = selectedLeft === item.id;
            const number = matchNumber[item.id];

            return (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                disabled={disabled}
                className={cn(
                  "w-full rounded-lg border-2 p-4 text-left text-lg font-semibold transition-all hover:bg-blue-50 active:scale-95",
                  isSelected && "border-blue-500 bg-blue-100 shadow-lg",
                  isMatched && status === "none" && "border-blue-500 bg-blue-50 text-blue-700",
                  isMatched && status === "correct" && "border-green-500 bg-green-50 text-green-700",
                  isMatched && status === "wrong" && "border-red-500 bg-red-50 text-red-700",
                  !isMatched &&
                    !isSelected &&
                    "border-neutral-300 bg-white hover:border-blue-300",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {isMatched && (
                    <span className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                      status === "none" && "bg-blue-500",
                      status === "wrong" && "bg-red-500",
                      status === "correct" && "bg-green-500"
                    )}>
                      {number}
                    </span>
                  )}
                  <span className="flex-1">{item.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = isRightMatched(item.id);
            const number = getMatchNumberForRight(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={disabled || selectedLeft === null || isMatched}
                className={cn(
                  "w-full rounded-lg border-2 p-4 text-left text-lg font-semibold transition-all hover:bg-blue-50 active:scale-95",
                  isMatched && status === "none" && "border-blue-500 bg-blue-50 text-blue-700",
                  isMatched && status === "correct" && "border-green-500 bg-green-50 text-green-700",
                  isMatched && status === "wrong" && "border-red-500 bg-red-50 text-red-700",
                  !isMatched &&
                    "border-neutral-300 bg-white hover:border-blue-300",
                  selectedLeft !== null &&
                    !isMatched &&
                    "border-blue-300 hover:border-blue-500 shadow-md",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {isMatched && (
                    <span className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                      status === "none" && "bg-blue-500",
                      status === "wrong" && "bg-red-500",
                      status === "correct" && "bg-green-500"
                    )}>
                      {number}
                    </span>
                  )}
                  <span className="flex-1">{item.text}</span>
                </div>
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
