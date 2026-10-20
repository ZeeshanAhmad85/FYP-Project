"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import Image from "next/image";
import { uploadData } from "aws-amplify/storage";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/shared/loading";
import { getResumeById, updateResume } from "@/data/data";
import { removePrefix } from "@/lib/utils";

interface ResumeProps {
  onClose: () => void;
  initialFile?: File | null;
  resumeId: string;
  onSave: () => void;
}

function EditResumeModal({ onClose, resumeId, onSave }: ResumeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<any>();

  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState("");
  const [resumeTitle, setResumeTitle] = useState<any>("");
  const [uploadedResume, setUploadedResume] = useState<any>();
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState<any>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    resume?: string;
    resumeTitle?: string;
  }>({});

  const [isFetching, setIsFetching] = useState(false);

  //   DATA FETCHING
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setIsFetching(true);
        const resume = await getResumeById(resumeId);
        setResume(resume);

        setResumeTitle(resume?.title);
        setIsActive(resume?.active);
        setFileName(removePrefix(resume?.path, "resumes/"));
      } catch (error) {
        toast.error("An error occurred while fetching the data.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchResume();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];
      if (newFile && newFile.type !== "application/pdf") {
        toast.error("Invalid file type. Please upload a PDF file.");
        return;
      }
      if (newFile.size > 5 * 1024 * 1024) {
        // Check file size in bytes
        toast.error("File size should not exceed 5 MB.");
        return;
      }

      setFile(newFile);
      setIsUploading(true);

      try {
        const timestamp = Date.now();
        const fileNameParts = newFile.name.split(".");
        const baseName = fileNameParts.slice(0, -1).join(".");
        const extension = fileNameParts.pop();
        const newFileName = `${baseName}-${timestamp}.${extension}`;

        const result = await uploadData({
          path: `resumes/${newFileName}`,
          data: newFile,
          options: {
            contentType: "application/pdf",
          },
        }).result;
        setUploadedResume(result);
        setFileName(removePrefix(result?.path, "resumes/"));
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading file", error);
        setIsUploading(false);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateForm = () => {
    const newErrors: { resume?: string; resumeTitle?: string } = {};

    if (!resumeTitle.trim()) {
      newErrors.resumeTitle = "Resume title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      //   Update the resume
      if (
        resumeTitle.trim() === resume?.title &&
        isActive === resume?.active &&
        !file
      ) {
        onClose();
        return;
      }
      const updatedResume = await updateResume({
        id: resumeId,
        title: resumeTitle,
        active: isActive,
        path: uploadedResume?.path,
        userId: resume?.userId,
      });
      toast.success("Resume updated successfully.");
      onSave();
    } catch (error) {
      const message = "An error occurred while saving the data.";
      toast.error("An error occurred while saving the data.", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));

    return (
      parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2)) + " " + units[i]
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
      <div
        className="bg-[#F7F7F7] z-[99999] sm:w-[600px] my-6 overflow-hidden sm:max-w-[600px] flex flex-col py-6 px-8 rounded-[8px]"
        style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
      >
        <div className="flex w-full justify-end">
          <button
            className="bg-[#EAECF0] overflow-hidden flex items-center justify-center rounded-[8px] cursor-pointer py-3 px-3"
            onClick={onClose}
          >
            <Image
              src="/assets/cross.svg"
              alt=""
              width={16}
              height={16}
              priority
            />
          </button>
        </div>

        <div className="mb-6 mt-[-1.4rem] text-center">
          <h1 className="text-[24px] text-center text-text-primary font-[700] mb-[4px]">
            Edit Your Resume
          </h1>
          <p className="text-[#667085] text-[14px]">
            Change the title or replace the PDF
          </p>
        </div>

        <div className="flex justify-between items-center bg-white border border-[#EAECF0] rounded-[8px] p-2 mb-3">
          <div className="flex">
            <div className="border flex justify-center items-center border-[#EAECF0] rounded-[8px] p-2">
              <Image
                src="/assets/svg/file.svg"
                alt=""
                width={24}
                height={24}
                priority
              />
            </div>

            <div className="ml-4">
              <p className="text-[14px] font-[500] text-[#344054]">
                {isUploading ? "Uploading..." : fileName}
                {isFetching && "Loading..."}
              </p>
              <p className="text-[12px] text-[#667085] mt-2">
                {uploadedResume && formatFileSize(uploadedResume?.size)}
              </p>
            </div>
          </div>

          <div>
            <button className="flex justify-end" onClick={handleBrowseClick}>
              <Image
                src="/assets/svg/upload.svg"
                alt=""
                height={32}
                width={32}
                priority
              />
            </button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="application/pdf"
        />

        <div className="w-full">
          <label
            htmlFor="resumeTitle"
            className="block text-sm font-[700] text-text-primary mb-2"
          >
            Resume Title
          </label>
          <Input
            type="text"
            placeholder="Enter Resume Title"
            value={isFetching ? "Loading..." : resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className={`text-[#344054] font-[500] text-[16px] bg-white ${
              errors.resumeTitle ? "border-error" : ""
            }`}
            style={errors.resumeTitle ? { borderColor: "var(--error)" } : {}}
          />
          {errors.resumeTitle && (
            <p className="text-error text-xs mt-1">{errors.resumeTitle}</p>
          )}
        </div>
        <div className="w-full my-4 flex items-center px-3 py-4 rounded-[8px] justify-between border border-[#D0D5DD]">
          <div>
            <p className="text-[15px] font-[700] text-text-primary">
              Resume Status
            </p>
          </div>
          <div className="flex space-x-2">
            <label className="block text-[15px] font-[700] text-text-primary">
              Inactive
            </label>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              className={`${
                isActive ? "bg-primary" : "bg-white"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  isActive ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <label className="block text-[15px] font-[700] text-text-primary">
              Active
            </label>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            size={"default"}
            variant={"default"}
            className="w-full text-[16px] font-[500] !py-6 bg-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex gap-1">
                <Loading />
                Saving
              </span>
            ) : (
              "Save & Close"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditResumeModal;
