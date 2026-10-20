import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

interface NoResumeUploadedProps {
  onClose: () => void;
  onButtonClick: () => void;
}

function NoResumeUploaded({ onClose, onButtonClick }: NoResumeUploadedProps) {
  return (
    <div className="w-full py-[4rem] flex flex-col justify-center items-center space-y-5">
      <Image
        src="/assets/upload-resume-icon.svg"
        height={97}
        width={114}
        alt=""
      />
      <h1 className="text-[#667085] text-[14px] font-[500]">
        No resumes yet, get started by uploading yours
      </h1>
      <Button
        className="bg-transparent border border-[#EAECF0] rounded-[8px] hover:bg-white font-[500] text-[14px] text-[#344054]"
        onClick={onButtonClick}
      >
        Upload Resume
      </Button>
    </div>
  );
}

export default NoResumeUploaded;
