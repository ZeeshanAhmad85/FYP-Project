"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  text: string;
}

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (answers: Record<string, string>) => void;
  sectionTitle: string;
  questions: Question[];
  showModalButtonText: string;
  credits?: any;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

function AiModal({
  isOpen,
  onClose,
  onContinue,
  sectionTitle,
  questions,
  showModalButtonText,
  credits,
}: AiModalProps) {
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const initialAnswers: Record<number, string> = {};
    questions.forEach((_, index) => {
      initialAnswers[index] = "";
    });
    return initialAnswers;
  });

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleContinue = () => {
    const questionAnswerPairs: Record<string, string> = {};
    questions.forEach((question, index) => {
      questionAnswerPairs[question.text] = answers[index];
    });

    onContinue(questionAnswerPairs);

    const resetAnswers: Record<number, string> = {};
    questions.forEach((_, index) => {
      resetAnswers[index] = "";
    });
    setAnswers(resetAnswers);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              Number of Questions to generate{" "}
              {sectionTitle[0].toUpperCase() + sectionTitle.slice(1)}?
            </h2>

            <p className="text-blue-600 mb-6">{credits || 0} credits left</p>
            <div className="h-full max-h-[400px] overflow-y-auto px-2 custom-scrollbar">
              {questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Q{index + 1} : {question?.text}
                  </label>
                  <textarea
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-gray-600">Required Credits: 5</div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleContinue}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={showModalButtonText === "Generating..."}
                >
                  {showModalButtonText}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AiModal;
