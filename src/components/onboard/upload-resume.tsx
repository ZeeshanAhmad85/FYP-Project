"use client";

import React, { useState, useRef } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import { Loader2, MousePointerSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { uploadData } from "aws-amplify/storage";
import { createResume } from "@/data/data";
import Loading from "../shared/loading";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";

const UploadResume: React.FC<{ user: any }> = ({ user }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [file, setFile] = useState<any | null>();
  const [resumeTitle, setResumeTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState<any>();

  //  Uploading Data to database
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    resume?: string;
    resumeTitle?: string;
  }>({});

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
          contentType: "application/pdf",
        },
      }).result;

      setResumeUploaded(result);
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
      toast.error("Resume file is required.");
    }
    if (
      !resumeTitle.trim() ||
      resumeTitle.length < 3 ||
      resumeTitle.length > 20
    ) {
      newErrors.resumeTitle =
        "Resume title is at least 3 characters long and at most 20 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const userId = user?.userId || localStorage?.getItem("id");

    try {
      setIsLoading(true);
      const resume = await createResume({
        title: resumeTitle,
        userId: userId,
        path: resumeUploaded?.path,
      });
      if (resume) {
        router.push(`/onboarding/create-link?resumeId=${resume.id}`);
        toast.success("Data Created Successfully");
      }
    } catch (error) {
      const message = error || "An error occurred while saving the data.";
      toast.error("An error occurred while saving the data.", {
        description: `${message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center h-full">
      <div className="w-full flex justify-between">
        <button
          onClick={() => router?.push("/onboarding/upload-resume")}
          className="text-[#344054] font-[500] pt-[4rem] flex item-center uppercase"
        >
          <Image src="/assets/svg/back.svg" height={24} width={24} alt="" />{" "}
          <span className="ml-2">back</span>
        </button>
        <button
          onClick={() => {
            handleUpdateOnboarding().then(() => {
              toast.success("Onboarding skipped successfully");
              router?.push("/overview");
            });
          }}
          className="text-[#344054] font-[500] pt-[4rem] uppercase"
        >
          skip
        </button>
      </div>
      <div className="w-full lg:w-[70%] flex flex-col space-y-9 items-center px-4 py-[4rem]">
        <div>
          <h1 className="text-[24px] text-center text-text-primary font-[700] mb-[4px]">
            Upload Your Resume
          </h1>
          <p className="text-center text-text-secondary">
            Upload your 1st resume and get started right now.
          </p>
        </div>
        <div
          className={cn(
            "relative flex-1 my-10 w-full custom-dashed-border bg-white flex justify-center flex-col items-center",
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
                            />
                            <span className="font-[500] text-[14px] text-center">
                              <label>
                                Drag & Drop Your File here or{" "}
                                <span className="bg-none text-[#3789CD] underline cursor-pointer">
                                  Browse
                                </span>{" "}
                                to Upload
                              </label>
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

        <div className="w-full flex">
          <Button
            size={"default"}
            variant={"default"}
            className="w-full bg-primary"
            onClick={handleSubmit}
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
  );
};

export default UploadResume;
