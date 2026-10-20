"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Lock, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Job description state
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const validateFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload a PDF or DOCX file.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "File size exceeds the 5MB limit. Please upload a smaller file."
      );
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      return true;
    }
    return false;
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Function to run the step animation regardless of API speed
  const runStepByStepAnimation = () => {
    // Step 1 - after 1.5s
    setTimeout(() => setCurrentStep(1), 1500);

    // Step 2 - after 3s
    setTimeout(() => setCurrentStep(2), 3000);

    // Step 3 - after 4.5s
    setTimeout(() => setCurrentStep(3), 4500);
  };

  // Function to ensure animation completes before proceeding
  const ensureAnimationComplete = async () => {
    return new Promise((resolve) => {
      const checkComplete = () => {
        if (currentStep >= 3) {
          resolve(true);
        } else {
          // Check again in 500ms
          setTimeout(checkComplete, 500);
        }
      };

      // Wait minimum 5s for animation to look natural
      setTimeout(() => {
        checkComplete();
      }, 5000);
    });
  };

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    // Validate job description if option is selected
    if (
      showJobDescription &&
      (!jobDescription || jobDescription.trim() === "")
    ) {
      toast.error("Please enter a job description.");
      return;
    }

    setIsUploading(true);
    setAnalysisStage("uploading");

    // Create form data for API request
    const formData = new FormData();
    formData.append("resume_file", file);

    // Add job description if available
    if (showJobDescription && jobDescription) {
      formData.append("job_description", jobDescription);
    }

    try {
      // Initialize loading states
      setUploadProgress(0);

      // Start with upload simulation
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Switch to analysis stage after upload reaches 90%
      setTimeout(() => {
        setAnalysisStage("analyzing");
        clearInterval(uploadInterval);
        setUploadProgress(100);

        // Start the step-by-step analysis animation
        runStepByStepAnimation();
      }, 3000);

      // Use job matching API if job description is provided, otherwise use ATS-only API
      const apiEndpoint =
        showJobDescription && jobDescription
          ? `${process.env.NEXT_PUBLIC_API_URL}/analyze/job-matching`
          : `${process.env.NEXT_PUBLIC_API_URL}/analyze/ats-only`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Error response:", errorData);
        throw new Error(
          `Error ${response.status}: ${JSON.stringify(
            errorData || "Unknown error"
          )}`
        );
      }

      const analysisResult = await response.json();
      sessionStorage.setItem(
        "atsAnalysisResult",
        JSON.stringify(analysisResult)
      );

      // Wait for animation to complete before transitioning to complete state
      // This ensures user sees all steps even if API is faster
      //   await ensureAnimationComplete();

      setAnalysisStage("complete");
      toast.success("Resume analysis complete!");

      setTimeout(() => {
        router.push("/ats-result");
      }, 1000);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Failed to analyze resume. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
      setAnalysisStage(null);
      setCurrentStep(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-full w-full mx-auto">
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div
          className={cn(
            "relative flex-1 p-6 w-full border-2 border-dashed rounded-lg transition-colors min-h-[200px]",
            {
              "border-blue-500 bg-blue-50": isDragging,
              "border-gray-300 bg-gray-50": !isDragging && !isUploading,
              "border-gray-200 bg-gray-50": isUploading,
            }
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              {analysisStage === "uploading" && (
                <>
                  <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-700 mb-2 font-medium">
                    Uploading resume...
                  </p>
                  <Progress
                    value={uploadProgress}
                    className="w-full h-2 mt-2 bg-gray-200"
                  />
                </>
              )}

              {analysisStage === "analyzing" && (
                <>
                  <div className="relative mb-4">
                    <FileText className="w-10 h-10 text-blue-500 mx-auto" />
                    <motion.div
                      className="absolute -top-1 -right-1"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    >
                      <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </motion.div>
                  </div>
                  <p className="text-gray-700 mb-2 font-medium">
                    Analyzing your resume...
                  </p>

                  {/* Step-based progress indicators with improved animations */}
                  <div className="w-full max-w-md mt-4 space-y-3">
                    {/* Step 1 */}
                    <div className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{
                          opacity: currentStep >= 1 ? 1 : 0.5,
                          backgroundColor:
                            currentStep >= 1 ? "#dbeafe" : "#f3f4f6",
                        }}
                        className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-2"
                      >
                        {currentStep >= 1 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </motion.div>
                        ) : (
                          <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                        )}
                      </motion.div>
                      <div className="flex-grow">
                        <motion.p
                          className="text-sm"
                          initial={{ fontWeight: "normal", color: "#6b7280" }}
                          animate={{
                            fontWeight: currentStep === 1 ? "bold" : "normal",
                            color: currentStep >= 1 ? "#1f2937" : "#6b7280",
                          }}
                        >
                          Step 1: Initial extraction and structure analysis
                        </motion.p>
                        {currentStep > 1 && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-green-600"
                          >
                            Step 1 completed
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{
                          opacity: currentStep >= 2 ? 1 : 0.5,
                          backgroundColor:
                            currentStep >= 2 ? "#dbeafe" : "#f3f4f6",
                        }}
                        className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-2"
                      >
                        {currentStep >= 2 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </motion.div>
                        ) : (
                          <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                        )}
                      </motion.div>
                      <div className="flex-grow">
                        <motion.p
                          className="text-sm"
                          initial={{ fontWeight: "normal", color: "#6b7280" }}
                          animate={{
                            fontWeight: currentStep === 2 ? "bold" : "normal",
                            color: currentStep >= 2 ? "#1f2937" : "#6b7280",
                          }}
                        >
                          Step 2: ATS optimization analysis
                        </motion.p>
                        {currentStep > 2 && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-green-600"
                          >
                            Step 2 completed
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{
                          opacity: currentStep >= 3 ? 1 : 0.5,
                          backgroundColor:
                            currentStep >= 3 ? "#dbeafe" : "#f3f4f6",
                        }}
                        className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-2"
                      >
                        {currentStep >= 3 ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </motion.div>
                        ) : (
                          <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                        )}
                      </motion.div>
                      <div className="flex-grow">
                        <motion.p
                          className="text-sm"
                          initial={{ fontWeight: "normal", color: "#6b7280" }}
                          animate={{
                            fontWeight: currentStep === 3 ? "bold" : "normal",
                            color: currentStep >= 3 ? "#1f2937" : "#6b7280",
                          }}
                        >
                          Step 3: ATS optimization feedback
                        </motion.p>
                        {currentStep > 3 && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-green-600"
                          >
                            Step 3 completed
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="w-full mt-4"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      repeatType: "reverse",
                    }}
                  >
                    <Progress value={95} className="w-full h-2 bg-gray-200" />
                  </motion.div>
                </>
              )}

              {analysisStage === "complete" && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-700 mb-2 font-medium">
                    Analysis complete!
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    Redirecting to your results...
                  </p>
                </>
              )}
            </div>
          ) : file ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    {file.type.includes("pdf") ? (
                      <span className="text-red-500 font-bold">PDF</span>
                    ) : (
                      <span className="text-blue-500 font-bold">DOC</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-1 font-medium">
                Drop your resume here
              </p>
              <p className="text-sm text-gray-500">
                or{" "}
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={handleButtonClick}
                >
                  browse
                </span>{" "}
                to upload
              </p>
              <p className="text-xs text-gray-400 mt-3">
                PDF & DOCX files. Max 5MB file size.
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileInput}
        />

        {/* Job Description Toggle Section */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center mb-3">
            <button
              type="button"
              onClick={() => setShowJobDescription(!showJobDescription)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <div
                className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${
                  showJobDescription
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-400"
                }`}
              >
                {showJobDescription && (
                  <CheckCircle className="h-3 w-3 text-white" />
                )}
              </div>
              Include job description for better matching
            </button>
          </div>

          {showJobDescription && (
            <div
              className="space-y-3"
              style={{
                animation: "fadeIn 0.3s ease-out forwards",
              }}
            >
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Adding a job description helps our AI match your resume to
                  specific job requirements, giving you more targeted feedback.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Paste job description
                </label>
                <textarea
                  id="jobDescription"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={analyzeResume}
            disabled={isUploading || !file}
          >
            {isUploading
              ? "Processing..."
              : file
              ? "Analyze Resume"
              : "Select Resume File"}
          </Button>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <Lock className="h-3 w-3 mr-1" />
          <span>Your resume data is secure and private</span>
        </div>
      </div>
    </div>
  );
}
