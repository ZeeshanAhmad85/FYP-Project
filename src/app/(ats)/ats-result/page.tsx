"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertTriangle, FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import Link from "next/link";

// Update interface to match the actual API response structure
interface Issue {
  message: string;
  severity: string;
}

interface CategoryAnalysis {
  category: string; // Changed from 'name' to 'category'
  score: number;
  issues_found: number; // Changed from 'issues' to 'issues_found'
  issues: Issue[];
  analysis: string | null;
  suggestions: string[] | null;
}

interface ATSResult {
  overall_score: number; // Changed from 'score' to 'overall_score'
  ats_parse_rate: number; // Changed from 'parse_rate' to 'ats_parse_rate'
  categories: CategoryAnalysis[];
  potential_improvement: number | null;
}

export default function ATSResult() {
  const [activeTab, setActiveTab] = useState("");
  const [analysisResult, setAnalysisResult] = useState<ATSResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to convert category id to display name
  const getCategoryDisplayName = (categoryId: string): string => {
    const categoryMap: { [key: string]: string } = {
      content: "Content",
      format: "Format",
      sections: "Sections",
      skills: "Skills",
      style: "Style",
    };
    return (
      categoryMap[categoryId] ||
      categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
    );
  };

  // Retrieve the analysis results from sessionStorage
  useEffect(() => {
    const savedResult = sessionStorage.getItem("atsAnalysisResult");
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setAnalysisResult(parsedResult);

        // Set active tab to the category with the most issues
        if (parsedResult.categories && parsedResult.categories.length > 0) {
          const categoryWithMostIssues = parsedResult.categories.reduce(
            (prev: CategoryAnalysis, current: CategoryAnalysis) =>
              current.issues_found > prev.issues_found ? current : prev,
            parsedResult.categories[0]
          );
          setActiveTab(categoryWithMostIssues.category);
        }
      } catch (error) {
        console.error("Error parsing stored analysis result:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analysis results...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            No Analysis Results Found
          </h2>
          <p className="text-gray-600 mb-6">
            We {"couldn't"} find any analysis results. Please upload your resume
            to get started.
          </p>
          <Link href="/resume-checker">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upload Your Resume
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-5 sm:px-8 bg-white">
      {/* Header */}
      <header className="flex items-center justify-between py-4 border-b">
        <div className="flex gap-2">
          <Image
            src="/assets/logo-new.svg"
            alt="Logo"
            width={135}
            height={40}
          />
        </div>
        <Link href="/resume-checker">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Upload New Resume
          </Button>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r bg-gray-50">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="font-medium text-center">Your Score</h3>
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="8"
                      stroke="#e5e7eb"
                      fill="none"
                    />
                    {/* Foreground circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      strokeWidth="8"
                      stroke="#3b82f6"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        45 *
                        (1 - (analysisResult?.overall_score || 0) / 100)
                      }
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {analysisResult?.overall_score || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {analysisResult?.categories?.map((category) => (
                <div
                  key={category.category}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    activeTab === category.category
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(category.category)}
                >
                  <div className="flex items-center">
                    {category.category === "content" && (
                      <div className="w-6 h-6 mr-2">
                        <svg
                          width="20"
                          height="18"
                          viewBox="0 0 20 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M18.25 0.77002H1.75C0.921573 0.77002 0.25 1.44159 0.25 2.27002V15.77C0.25 16.5984 0.921573 17.27 1.75 17.27H18.25C19.0784 17.27 19.75 16.5984 19.75 15.77V2.27002C19.75 1.44159 19.0784 0.77002 18.25 0.77002ZM4 11.27H2.5C2.08579 11.27 1.75 10.9342 1.75 10.52C1.75 10.1058 2.08579 9.77002 2.5 9.77002H4C4.41421 9.77002 4.75 10.1058 4.75 10.52C4.75 10.9342 4.41421 11.27 4 11.27ZM4 8.27002H2.5C2.08579 8.27002 1.75 7.93423 1.75 7.52002C1.75 7.10581 2.08579 6.77002 2.5 6.77002H4C4.41421 6.77002 4.75 7.10581 4.75 7.52002C4.75 7.93423 4.41421 8.27002 4 8.27002ZM4 5.27002H2.5C2.08579 5.27002 1.75 4.93423 1.75 4.52002C1.75 4.10581 2.08579 3.77002 2.5 3.77002H4C4.41421 3.77002 4.75 4.10581 4.75 4.52002C4.75 4.93423 4.41421 5.27002 4 5.27002ZM18.25 15.77H6.25V2.27002H18.25V15.77Z"
                            fill="#1C1C21"
                          />
                        </svg>
                      </div>
                    )}
                    {category.category === "format" && (
                      <div className="w-6 h-6 mr-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6h16M4 12h16M4 18h12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    {category.category === "sections" && (
                      <div className="w-6 h-6 mr-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z M7 7h10 M7 12h10 M7 17h6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    {category.category === "skills" && (
                      <div className="w-6 h-6 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                    )}
                    {category.category === "style" && (
                      <div className="w-6 h-6 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 7V4h16v3" />
                          <path d="M9 20h6" />
                          <path d="M12 4v16" />
                        </svg>
                      </div>
                    )}
                    <span
                      className={`font-medium ${
                        activeTab === category.category ? "text-blue-600" : ""
                      }`}
                    >
                      {getCategoryDisplayName(category.category)}
                    </span>
                  </div>
                  {category.issues_found > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                      {category.issues_found}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                {analysisResult && analysisResult.ats_parse_rate >= 80 ? (
                  <span className="font-medium text-green-600">Excellent!</span>
                ) : analysisResult && analysisResult.ats_parse_rate >= 60 ? (
                  <span className="font-medium text-green-600">Great!</span>
                ) : analysisResult && analysisResult?.ats_parse_rate >= 40 ? (
                  <span className="font-medium text-amber-600">Fair</span>
                ) : (
                  <span className="font-medium text-red-600">
                    Needs Improvement
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  Parsed ({analysisResult?.ats_parse_rate ?? 0}%)
                </span>
              </div>
              <Progress
                value={analysisResult?.ats_parse_rate}
                className="h-2 bg-gray-200"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            {analysisResult?.categories.map(
              (category) =>
                activeTab === category.category && (
                  <div
                    key={category.category}
                    className="bg-white p-6 rounded-md shadow-sm"
                  >
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">
                      {getCategoryDisplayName(category.category).toUpperCase()}
                    </h3>
                    <p className="text-red-500 mb-6">
                      {category.issues_found} Issues Found
                    </p>

                    {/* Analysis section if available */}
                    {category.analysis && (
                      <div className="mb-6">
                        <h4 className="text-lg text-gray-600 mb-2">Analysis</h4>
                        <p className="text-gray-600">{category.analysis}</p>
                      </div>
                    )}

                    {/* Issues section if there are issues */}
                    {category.issues && category.issues.length > 0 && (
                      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md mb-6">
                        <h4 className="font-medium text-yellow-800 mb-2">
                          Issues Detected
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-yellow-700">
                          {category.issues.map((issue, index) => (
                            <li
                              key={index}
                              className={
                                issue.severity === "error"
                                  ? "text-red-600"
                                  : "text-yellow-700"
                              }
                            >
                              {issue.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions section */}
                    {category.suggestions &&
                      category.suggestions.length > 0 && (
                        <div>
                          <h4 className="text-lg text-gray-600 mb-4">
                            Suggestions for improvement
                          </h4>
                          <div className="space-y-4">
                            {category.suggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                  <Check className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-gray-600">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* If no issues and no suggestions, show success message */}
                    {category.issues_found === 0 &&
                      (!category.suggestions ||
                        category.suggestions.length === 0) && (
                        <div className="p-4 border border-green-200 bg-green-50 rounded-md">
                          <h4 className="font-medium text-green-800 mb-2">
                            Great work!
                          </h4>
                          <p className="text-green-700">
                            No issues found in this category. Your resume is
                            well-optimized for ATS systems in this aspect.
                          </p>
                        </div>
                      )}
                  </div>
                )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
