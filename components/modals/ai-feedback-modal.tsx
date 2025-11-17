"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { markFeedbackHelpful } from "@/actions/mistake-tracking";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MistakeType =
  | "ARTICLE"
  | "PREPOSITION"
  | "TENSE"
  | "SUBJECT_VERB_AGREEMENT"
  | "WORD_ORDER"
  | "VOCABULARY"
  | "SPELLING"
  | "PLURAL_SINGULAR"
  | "PRONOUN"
  | "ADJECTIVE_ADVERB"
  | "COMPARATIVE_SUPERLATIVE"
  | "MODAL_VERB"
  | "PASSIVE_ACTIVE"
  | "CONDITIONAL"
  | "OTHER";

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  explanation: string;
  grammarRule?: string;
  examples?: string[];
  alternatives?: string[];
  mistakeType?: MistakeType;
  commonMistakeForVietnamese?: string;
  encouragement: string;
  feedbackId?: number;
}

export const AIFeedbackModal = ({
  isOpen,
  onClose,
  explanation,
  encouragement,
  feedbackId,
}: AIFeedbackModalProps) => {
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    setWasHelpful(helpful);
    if (feedbackId) {
      await markFeedbackHelpful(feedbackId, helpful);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setWasHelpful(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/mascot_sad.svg"
              alt="Try again"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            💡 Giải thích đáp án
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          AI-powered feedback explanation
        </DialogDescription>

        <div className="space-y-4 py-4">
          {/* Giải thích lỗi */}
          <div className="text-sm leading-relaxed text-center">
            {explanation}
          </div>

          {/* Lời động viên */}
          <div className="text-sm text-center font-medium text-blue-600 dark:text-blue-400">
            {encouragement}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          {/* Feedback về tính hữu ích */}
          {feedbackId && (
            <div className="flex items-center justify-center gap-2 text-sm w-full">
              <span className="text-muted-foreground">Hữu ích?</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={wasHelpful === true ? "default" : "primaryOutline"}
                  onClick={() => void handleFeedback(true)}
                  disabled={wasHelpful !== null}
                >
                  👍
                </Button>
                <Button
                  size="sm"
                  variant={wasHelpful === false ? "default" : "primaryOutline"}
                  onClick={() => void handleFeedback(false)}
                  disabled={wasHelpful !== null}
                >
                  👎
                </Button>
              </div>
            </div>
          )}

          <Button onClick={onClose} className="w-full">
            Đã hiểu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
