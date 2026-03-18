"use client";

import React from "react";
import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { EnhancedButton } from "./EnhancedButton";
import { EnhancedTextarea } from "./EnhancedInput";
import { useToast } from "@/hooks/useToast";
import api from "@/lib/api";

interface FeedbackWidgetProps {
  position?: "bottom-right" | "bottom-left";
}

/**
 * Feedback Widget.
 * @param {
  position = "bottom-right",
} - { position = "bottom right", } value.
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"rating" | "feedback" | "success">("rating");
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

/**
 * Handle Submit.
 */
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.warning("Please enter your feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/api/feedback", {
        rating,
        feedback: feedback.trim(),
        path: typeof window !== "undefined" ? window.location.pathname : undefined,
        userAgent: typeof window !== "undefined" ? navigator.userAgent : undefined,
        timestamp: new Date().toISOString(),
      });

      setStep("success");
      setTimeout(() => {
        setIsOpen(false);
        setStep("rating");
        setRating(null);
        setFeedback("");
      }, 2000);

      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingEmojis = [
    { value: 1, icon: Frown, label: "Poor", color: "text-turkey-red-500" },
    { value: 2, icon: Meh, label: "Fair", color: "text-safety-orange-500" },
    { value: 3, icon: Smile, label: "Good", color: "text-verdigris-500" },
  ];

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      {/* Feedback Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-dye-600 hover:bg-indigo-dye-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-dye-500/30 group"
          aria-label="Send Feedback"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Feedback Panel */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-80 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-dye-600 to-verdigris-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Send Feedback</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    setStep("rating");
                    setRating(null);
                    setFeedback("");
                  }, 300);
                }}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === "rating" && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How would you rate your experience?
                </p>
                <div className="flex justify-around">
                  {ratingEmojis.map(({ value, icon: Icon, label, color }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setRating(value);
                        setStep("feedback");
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        rating === value ? "bg-gray-100 dark:bg-gray-700" : ""
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${color}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "feedback" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tell us more about your experience
                  </p>
                  <button
                    onClick={() => setStep("rating")}
                    className="text-xs text-indigo-dye-600 dark:text-indigo-dye-400 hover:underline"
                  >
                    Change rating
                  </button>
                </div>

                <EnhancedTextarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What can we improve?"
                  rows={4}
                  maxLength={500}
                  showCount
                />

                <div className="flex gap-2">
                  <EnhancedButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setStep("rating")}
                    className="flex-1"
                  >
                    Back
                  </EnhancedButton>
                  <EnhancedButton
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                    iconPosition="right"
                    className="flex-1"
                  >
                    Submit
                  </EnhancedButton>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-8 animate-bounce-in">
                <div className="w-16 h-16 bg-verdigris-100 dark:bg-verdigris-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-verdigris-600 dark:text-verdigris-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your feedback helps us improve ShelfSpace
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Quick feedback buttons (thumbs up/down)
interface QuickFeedbackProps {
  onFeedback: (positive: boolean) => void;
  className?: string;
}

/**
 * Quick Feedback.
 * @param {
  onFeedback,
  className = "",
} - { on Feedback, class Name = "", } value.
 */
export const QuickFeedback: React.FC<QuickFeedbackProps> = ({
  onFeedback,
  className = "",
}) => {
  const [selected, setSelected] = useState<boolean | null>(null);

/**
 * Handle Feedback.
 * @param positive - positive value.
 */
  const handleFeedback = (positive: boolean) => {
    setSelected(positive);
    onFeedback(positive);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Was this helpful?
      </span>
      <button
        onClick={() => handleFeedback(true)}
        className={`p-2 rounded-lg transition-all ${
          selected === true
            ? "bg-verdigris-100 dark:bg-verdigris-900 text-verdigris-600 dark:text-verdigris-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFeedback(false)}
        className={`p-2 rounded-lg transition-all ${
          selected === false
            ? "bg-turkey-red-100 dark:bg-turkey-red-900 text-turkey-red-600 dark:text-turkey-red-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  );
};
