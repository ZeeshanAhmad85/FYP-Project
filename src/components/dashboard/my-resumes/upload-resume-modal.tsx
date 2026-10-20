"use client";

import React, { useState, useRef } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import { Loader2, MousePointerSquareDashed } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { uploadData } from "aws-amplify/storage";
import { createResume } from "@/data/data";
import Loading from "@/components/shared/loading";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
interface ResumeProps {
  onClose: () => void;
  onSave: () => void;
  onSaveAndCreateLink: any;
}

function UploadResumeModal({
  onClose,
  onSave,
  onSaveAndCreateLink,
}: ResumeProps) {
  const user = useAuthUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<any | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  //  Uploading Data to database
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClose, setIsLoadingClose] = useState(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    resume?: string;
    resumeTitle?: string;
  }>({});
  const [uploadedResume, setUploadedResume] = useState<any | null>(null);

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast.error(`${file.file.type} type is not supported.`, {
      description: "Please upload a valid PDF file.",
    });
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
    setIsDragOver(false);
    setIsUploading(true);

    try {
      // Generate a timestamp
      const timestamp = Date.now();
      // Create a new file name with the timestamp appended before the file extension
      const fileNameParts = newFile.name.split(".");
      const baseName = fileNameParts.slice(0, -1).join(".");
      const extension = fileNameParts.pop();
      const newFileName = `${baseName}-${timestamp}.${extension}`;

      const result = await uploadData({
        path: `resumes/${newFileName}`,
        data: newFile,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(
                (transferredBytes / totalBytes) * 100
              );
              setUploadProgress(progress);
            }
          },
        },
      }).result;
      setUploadedResume(result);
      setUploadProgress(0);
      setIsUploading(false);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onDropAccepted(Array.from(files));
    }
  };

  const validateForm = () => {
    const newErrors: { resume?: string; resumeTitle?: string } = {};
    if (!file) {
      newErrors.resume = "Resume file is required.";
    }
    if (!resumeTitle.trim()) {
      newErrors.resumeTitle = "Resume title is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (saveAndClose = true) => {
    if (!validateForm()) {
      return;
    }

    try {
      !saveAndClose && setIsLoading(true);
      saveAndClose && setIsLoadingClose(true);

      const resume = await createResume({
        title: resumeTitle,
        userId: user?.userId,
        path: uploadedResume?.path,
        active: isActive,
      });
      if (resume) {
        saveAndClose && onSave();
        !saveAndClose && onSaveAndCreateLink(resume);

        toast.success("Data Created Successfully");
      }
    } catch (error) {
      const message = error || "An error occurred while saving the data.";
      toast.error("An error occurred while saving the data.", {
        description: `${message}`,
      });
    } finally {
      setIsLoading(false);
      setIsLoadingClose(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
        <div
          className={`bg-[#F7F7F7] z-[99999] sm:w-[600px] my-6 overflow-hidden sm:max-w-[600px] flex flex-col py-6 px-8 rounded-[8px]`}
          style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
        >
          <div className="my-4 flex justify-end gap-x-[20%] text-center">
            <h1 className="text-[24px] text-center text-text-primary font-[700] mb-[4px]">
              Upload Your Resume
            </h1>
            <button
              className="bg-[#EAECF0] rounded-[8px] py-2 px-4 cursor-pointer"
              onClick={onClose}
            >
              <Image
                src="/assets/cross.svg"
                alt="cross"
                width={16}
                height={16}
              />
            </button>
          </div>
          <div
            className={cn(
              "relative flex-1 my-4 w-full custom-dashed-border bg-white flex justify-center flex-col items-center",
              {
                "ring-blue-900/25 bg-blue-900/10": isDragOver,
              }
            )}
          >
            <div className="relative flex px-[100px] py-[70px] max-w-[720px] flex-1 flex-col items-center justify-center w-full">
              <Dropzone
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                onDropRejected={onDropRejected}
                onDropAccepted={onDropAccepted}
                accept={{ "application/pdf": [".pdf"] }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    className="w-full flex-1 flex flex-col items-center justify-center"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragOver ? (
                      <MousePointerSquareDashed className="h-6 w-6 text-text-quaternary mb-2" />
                    ) : isUploading ? (
                      <Loader2 className="animate-spin h-6 w-6 text-text-quaternary mb-2" />
                    ) : (
                      ""
                    )}
                    <div className="flex flex-col justify-center items-center items mb-2 text-sm text-text-quaternary">
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center">
                          <p>Uploading...</p>
                          <Progress
                            value={uploadProgress}
                            className="mt-2 w-40 h-2 bg-gray-300"
                          />
                        </div>
                      ) : isDragOver ? (
                        <p>
                          <span className="font-[500] text-[14px]">
                            Drop file
                          </span>{" "}
                          to upload
                        </p>
                      ) : (
                        <div className="flex flex-col justify-center items-center space-y-3">
                          {file ? (
                            <span className="font-[500] text-[14px]">
                              {file.name}
                            </span>
                          ) : (
                            <>
                              <Image
                                src="/assets/upload-resume-icon.svg"
                                width={114}
                                height={97}
                                alt=""
                                priority={true}
                              />
                              <span className="font-[500] text-[14px] text-center">
                                <span>
                                  Drag & Drop Your File here or{" "}
                                  <span className="bg-none text-[#3789CD] underline cursor-pointer">
                                    Browse
                                  </span>{" "}
                                  to Upload
                                </span>
                              </span>
                            </>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>

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
              value={resumeTitle}
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

          <div className="w-full flex space-x-4">
            <Button
              size={"default"}
              variant={"default"}
              className="w-full text-[16px] font-[500] !py-6 bg-primary"
              onClick={() => handleSubmit(true)}
              disabled={isLoadingClose}
            >
              {isLoadingClose ? (
                <span className="flex gap-1">
                  <Loading />
                  Saving...
                </span>
              ) : (
                "Save & Close"
              )}
            </Button>
            <Button
              size={"default"}
              variant={"default"}
              className="w-full text-[16px] font-[500] !py-6 border text-[#344054] border-[#D0D5DD] hover:text-white hover:bg-primary bg-white"
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex gap-1">
                  <Loading />
                  Saving
                </span>
              ) : (
                "Save & Create Link"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadResumeModal;
