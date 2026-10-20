"use client";
import Decide from "@/components/onboard/decide";
import UploadResume from "@/components/onboard/upload-resume";
import useAuthUser from "@/hooks/use-auth-user";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

export default function UploadResumeWrapper() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader2Icon className="h-6 w-6 animate-spin" />
          <span> Loading template...</span>
        </div>
      }
    >
      <UploadPage />
    </Suspense>
  );
}

const UploadPage = () => {
  const user = useAuthUser();
  const searchParams = useSearchParams();

  //   On basis of Query Page will be shown
  const type = searchParams.get("type") || "decide"; // Default to "choose"
  return type === "upload" ? <UploadResume user={user} /> : <Decide />;
};
