"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  handleUpdateOnboarding,
  handleUpdateProfile,
} from "@/lib/cognitoActions";
import useAuthUser from "@/hooks/use-auth-user";
import { toast } from "sonner";
import Loading from "../shared/loading";
import { useRouter } from "next/navigation";
import { uploadData } from "aws-amplify/storage";

const ProfileSetup: React.FC = () => {
  const router = useRouter();
  const user = useAuthUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formState, setFormState] = useState<any>({
    fullName: "",
    profilePic: null,
    url: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      fullName: event.target.value,
    });

    if (event.target.value.trim() !== "") {
      setErrors({
        ...errors,
        fullName: "",
      });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (validTypes.includes(file.type)) {
        setIsUploading(true);
        try {
          // Generate a timestamp
          const timestamp = Date.now();
          // Create a new file name with the timestamp appended before the file extension
          const fileNameParts = file.name.split(".");
          const baseName = fileNameParts.slice(0, -1).join(".");
          const extension = fileNameParts.pop();
          const newFileName = `${baseName}-${timestamp}.${extension}`;
          const result = await uploadData({
            path: `profile-pictures/${newFileName}`,
            data: file,
            options: {
              contentType: file.type,
            },
          }).result;

          setFormState({
            ...formState,
            url: result?.path,
            profilePic: file,
          });

          setIsUploading(false);
        } catch (error) {
          console.error("Error uploading profile picture: ", error);
          setIsUploading(false);
          toast.error("Error uploading profile picture");
        }
      } else {
        toast.error("Please upload a jpg, jpeg, or png file.");
      }
    }
  };

  const handleRemove = () => {
    setFormState({
      ...formState,
      profilePic: null,
      url: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      fullName: "",
    };

    if (
      formState.fullName.trim() === "" ||
      formState.fullName.length < 3 ||
      formState.fullName.length > 20
    ) {
      newErrors.fullName =
        "Full name must be at least 3 characters long and at most 20 characters long";
    }

    setErrors(newErrors);

    if (newErrors.fullName) {
      return;
    }

    try {
      setIsLoading(true);

      await handleUpdateProfile(undefined, {
        fullName: formState.fullName,
        profilePic:
          formState?.url ||
          "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
      });

      localStorage.setItem("Name", formState.fullName);
      localStorage.setItem("Plan", user?.["custom:subscription"]);
      localStorage.setItem("id", user?.userId);

      router.push("/onboarding/upload-resume?type=decide");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center ">
      <div className="min-h-screen w-full lg:w-[70%] space-y-9 flex flex-col items-center px-4 pb-[4rem]">
        <div className="flex flex-col space-y-9 w-full">
          <h1 className="text-[24px] text-center text-text-primary font-[700] mb-[8px]">
            First, tell us a bit about yourself
          </h1>

          <div className="w-full">
            <label
              htmlFor="fullName"
              className="block text-sm font-[700] text-text-primary mb-2"
            >
              What’s your full name?
            </label>
            <Input
              type="text"
              placeholder="Your Name"
              value={formState.fullName}
              onChange={handleFullNameChange}
              className="bg-white text-[#344054] font-[500] text-[16px]"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col space-y-5">
          <label
            htmlFor="profilePic"
            className="block text-sm font-[700] text-text-primary mb-2"
          >
            Upload Your Profile Picture
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {formState.profilePic ? (
              <div className="relative h-[156px] w-[156px] rounded-[8px] overflow-hidden mb-2">
                <Image
                  src={URL.createObjectURL(formState.profilePic)}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="flex justify-center items-center h-[156px] w-[156px] bg-[#EAECF0] rounded-[8px] cursor-pointer"
                onClick={handleClick}
              >
                <div className="relative h-[56px] w-[56px]">
                  <Image src="/assets/upload.svg" alt="Upload" fill />
                </div>
              </div>
            )}
            {formState.profilePic ? (
              <div className="flex items-center space-x-5 ml-4">
                <Button
                  variant="default"
                  className="border py-6 text-primary bg-white hover:bg-[#EBEFF3] border-[#EAECF0]"
                  onClick={handleClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loading /> Uploading...
                    </span>
                  ) : (
                    "Replace picture"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  className="text-[#F04438] py-6 bg-transparent hover:text-white transition duration-200 hover:bg-[#F04438]"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                className="border py-6 ml-5 text-primary bg-white hover:bg-[#EBEFF3] border-[#EAECF0]"
                onClick={handleClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Loading /> Uploading...
                  </span>
                ) : (
                  "Upload picture"
                )}
              </Button>
            )}
          </div>
        </div>

        <Button
          size={"default"}
          variant={"default"}
          className="w-full my-4 bg-[#E6ECF8] hover:bg-primary hover:text-white transition-colors duration-100 text-primary py-6"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <span>Submitting...</span> : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;
