"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Save,
  Loader2,
  Loader2Icon,
  Play,
  Download,
  Share2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import EditResume from "@/components/templates/template-3/edit-resume-3";
import { initialData } from "@/components/templates/template-3/data";
import EditLayout from "@/components/templates/edit-layout";
import PreviewResume3 from "@/components/templates/template-3/preview-resume-3";
import { useReactToPrint } from "react-to-print";
import { motion, AnimatePresence } from "framer-motion";
import NotFoundClient from "@/components/dashboard/not-found-client";

export default function Template3Wrapper() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin" />
          <span> Loading template...</span>
        </div>
      }
    >
      <ResumePage />
    </Suspense>
  );
}

function ResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  const [resumeTitle, setResumeTitle] = useState("My Professional Resume");
  const [showNotFound, setShowNotFound] = useState(false);

  const [resumeData, setResumeData] = useState<any>(
    resumeId ? null : initialData
  ); // Conditional initial state
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const user = useAuthUser();

  // resume preview state and download function
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const CREDITS = Number(user?.["custom:credits"] ?? 0);

  const [localCredits, setLocalCredits] = useState(CREDITS);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resumeTitle || "Resume",
  });
  // Sync localCredits with CREDITS whenever CREDITS changes
  useEffect(() => {
    setLocalCredits(CREDITS);
  }, [CREDITS]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("id");
      if (storedId) {
        setUserId(storedId);
      } else {
        setUserId(user?.id);
      }
    }
  }, [user]);

  const updateUrlWithResumeId = useCallback(
    (id: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("resumeId", id);
      router.replace(url.pathname + url.search);
    },
    [router]
  );

  const handleDataChange = (data: any) => {
    setResumeData(data);
  };

  const saveResumeData = useCallback(
    async (autoSave = false) => {
      if (!resumeTitle) {
        toast.error("Please provide a title for your resume");
        return null;
      }
      if (!resumeData) {
        toast.error("No resume data to save");
        return null;
      }
      setIsSaving(true);
      try {
        const { createBuiltResume, updateBuiltResume } = await import(
          "@/data/data"
        );
        let savedResume;
        if (resumeId) {
          savedResume = await updateBuiltResume({
            id: resumeId,
            title: resumeTitle,
            data: resumeData,
            active: true,
          });
          if (!autoSave) {
            toast.success("Resume updated successfully!");
          }
        } else {
          savedResume = await createBuiltResume({
            title: resumeTitle,
            userId: userId || "1",
            templateType: "template-3",
            data: resumeData,
            active: true,
          });
          if (savedResume?.id) {
            updateUrlWithResumeId(savedResume.id);
          }
          if (!autoSave) {
            toast.success("Resume created successfully!");
          }
        }
        return savedResume;
      } catch (error) {
        console.error("Error saving resume:", error);
        if (!autoSave) {
          toast.error("Failed to save resume. Please try again.");
        }
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, resumeTitle, resumeData, updateUrlWithResumeId, userId]
  );

  const handleSaveResume = async () => {
    await saveResumeData(false);
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      if (resumeId) {
        setIsSaving(true);
        try {
          const { getResumeById } = await import("@/data/data");
          const resume = await getResumeById(resumeId);
          if (resume) {
            setResumeTitle(resume.title || "My Professional Resume");
            if (resume.data) {
              setResumeData(resume.data);
            }
          } else {
            setShowNotFound(true);
          }
        } catch (error) {
          console.error("Error fetching resume:", error);
          toast.error("Failed to load resume. Starting with a new template.");

          setShowNotFound(true);
          setResumeData(initialData); // Fallback to initialData
        } finally {
          setIsSaving(false);
        }
      }
    };
    fetchResumeData();
  }, [resumeId]);

  if (showNotFound) {
    return <NotFoundClient />;
  }

  return (
    <div
      className={`${
        showPreview == true ? `h-screen overflow-hidden` : `min-h-screen`
      } bg-gray-50 relative`}
    >
      <EditLayout showBackButton={false} localCredits={localCredits} />
      <div className="flex items-center justify-between px-2 gap-2 w-full max-w-[850px] mx-auto sm:px-4 pt-6">
        <Label htmlFor="resume-title" className="sr-only">
          Resume Title
        </Label>
        <Input
          id="resume-title"
          value={resumeTitle}
          onChange={(e) => setResumeTitle(e.target.value)}
          className="w-60 max-w-full border-none font-bold focus:outline-none focus:border-b focus:border-primary focus:ring-0"
          placeholder="Resume Title"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveResume}
            disabled={isSaving}
            className="flex items-center gap-2 h-[50] bg-[#e6ecf8] text-primary hover:bg-[#e6ecf8]/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {resumeId ? "Update title" : "Save title"}
              </>
            )}
          </Button>
          <Button
            className="bg-primary text-white h-[50] flex items-center justify-center"
            asChild
          >
            <Button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1"
            >
              <Play className="w-4 h-4 text-white" />
              <span className="text-white font-normal">Preview</span>
            </Button>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="flex flex-col gap-1 py-3 fixed inset-0 bg-black/60 z-50 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full mx-auto px-3 py-2"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div className="flex items-center justify-between px-2 gap-2 w-full max-w-[850px] mx-auto sm:px-4 py-2 mb-3">
                <Button
                  className="flex items-center gap-2 uppercase"
                  onClick={() => setShowPreview(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sm:block hidden">Back to Editor</span>
                </Button>
                <div className="flex gap-2">
                  <Button
                    className="bg-[#E6ECF8] hover:bg-[#E6ECF8]/90 text-primary h-[50] flex items-center justify-center gap-1"
                    onClick={() => router.push("/my-resume")}
                  >
                    <Share2 className="w-5 h-5 text-primary" />
                    <span className="text-primary font-normal">
                      Upload & Share
                    </span>
                  </Button>
                  <Button
                    className="bg-primary text-white h-[50] flex items-center justify-center gap-1"
                    onClick={() => reactToPrintFn()}
                  >
                    <Download className="w-5 h-5 text-white" />
                    <span className="text-white font-normal">Download</span>
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="w-[95%] md:w-1/2 mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <PreviewResume3 contentRef={contentRef} resumeData={resumeData} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {resumeData ? (
          <EditResume
            onDataChange={handleDataChange}
            initialResumeData={resumeData}
            onSuccessfulEdit={saveResumeData}
            resumeId={resumeId}
            key={resumeId || "new-resume"}
            localCredits={localCredits}
            setLocalCredits={setLocalCredits}
          />
        ) : (
          <div className="flex items-center h-[60vh] justify-center w-full">
            <div className="flex gap-1">
              <Loader2Icon className="h-6 w-6 animate-spin" />
              <span> Loading resume data...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
