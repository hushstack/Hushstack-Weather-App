"use client";

import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FeedbackModal } from "./feedback-modal";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Bottom Right */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "flex items-center gap-2",
          "px-4 py-3 rounded-full",
          "bg-gradient-to-r from-violet-500 to-fuchsia-500",
          "text-white font-medium text-sm",
          "shadow-[0_0_30px_rgba(139,92,246,0.4)]",
          "hover:shadow-[0_0_40px_rgba(139,92,246,0.6)]",
          "transition-all duration-300",
          "hover:scale-105 active:scale-95",
          "border border-white/20",
          "cursor-pointer"
        )}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageSquare className="h-5 w-5" />
        </motion.div>
        <span className="hidden sm:inline">Feedback</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && <FeedbackModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
