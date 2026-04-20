"use client";

import { X, Star, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { sendFeedback } from "@/lib/actions/send-feedback";

interface FeedbackModalProps {
  onClose: () => void;
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    const result = await sendFeedback({ name, email, rating, message });

    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Failed to send feedback");
    }

    setIsSubmitting(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-md",
          "glass-card rounded-3xl",
          "p-6 sm:p-8",
          "shadow-[0_0_60px_rgba(139,92,246,0.3)]"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 mb-4"
          >
            <Star className="h-7 w-7 text-violet-300" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Share Feedback</h2>
          <p className="text-white/60 text-sm">Help us improve your experience</p>
        </div>

        {/* Success State */}
        {status === "success" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8 text-green-400" />
            </motion.div>
            <p className="text-white font-medium">Thank you for your feedback!</p>
            <p className="text-white/50 text-sm">We appreciate your input.</p>
          </motion.div>
        )}

        {/* Form */}
        {status !== "success" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className={cn(
                  "w-full px-4 py-3 rounded-xl",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-white/30",
                  "focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
                  "transition-all"
                )}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={cn(
                  "w-full px-4 py-3 rounded-xl",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-white/30",
                  "focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
                  "transition-all"
                )}
              />
            </div>

            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-all duration-200",
                        (hoveredRating ? star <= hoveredRating : star <= rating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                          : "text-white/20"
                      )}
                    />
                  </motion.button>
                ))}
                <span className="ml-2 text-sm text-white/50">
                  {rating > 0 ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1] : "Select rating"}
                </span>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                required
                rows={4}
                className={cn(
                  "w-full px-4 py-3 rounded-xl resize-none",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-white/30",
                  "focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20",
                  "transition-all"
                )}
              />
            </div>

            {/* Error Message */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-3 rounded-xl"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "px-6 py-4 rounded-xl",
                "bg-gradient-to-r from-violet-500 to-fuchsia-500",
                "text-white font-medium",
                "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
                "hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]",
                "transition-all duration-300",
                "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Feedback
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
