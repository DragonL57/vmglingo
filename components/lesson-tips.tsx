"use client";

import { useState } from "react";

import { Lightbulb, BookOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";

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

type LessonTipsProps = {
  tips?: LessonTip[];
  grammarNotes?: GrammarNote[];
  onClose?: () => void;
  compact?: boolean;
};

export const LessonTips = ({
  tips = [],
  grammarNotes = [],
  onClose,
  compact = false,
}: LessonTipsProps) => {
  const [activeTab, setActiveTab] = useState<"tips" | "grammar">("tips");

  if (tips.length === 0 && grammarNotes.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="rounded-xl border-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900">
              {tips[0]?.title || "Gợi ý"}
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              {tips[0]?.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white">
        <h2 className="text-lg font-bold">Ghi chú bài học</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b-2">
        {tips.length > 0 && (
          <button
            onClick={() => setActiveTab("tips")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors",
              activeTab === "tips"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-neutral-500 hover:bg-neutral-50"
            )}
          >
            <Lightbulb className="h-4 w-4" />
            Gợi ý
          </button>
        )}
        {grammarNotes.length > 0 && (
          <button
            onClick={() => setActiveTab("grammar")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors",
              activeTab === "grammar"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-neutral-500 hover:bg-neutral-50"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Ngữ pháp
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "tips" && (
          <div className="space-y-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500"
              >
                <h3 className="font-bold text-blue-900">{tip.title}</h3>
                <p className="mt-2 text-neutral-700">{tip.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="space-y-6">
            {grammarNotes.map((note) => (
              <div key={note.id} className="space-y-3">
                <h3 className="text-lg font-bold text-neutral-800">
                  {note.title}
                </h3>
                <p className="text-neutral-700">{note.explanation}</p>
                <div className="rounded-lg bg-neutral-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-neutral-600">
                    Ví dụ:
                  </p>
                  <ul className="space-y-2">
                    {note.examples.map((example, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-neutral-700"
                      >
                        <span className="text-blue-500">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
