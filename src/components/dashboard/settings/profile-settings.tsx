"use client";
import React, { use, useEffect, useState } from "react";
import SettingsCard from "./settings-card";
import Image from "next/image";
import { Input } from "@/components/ui/input-simple";
import { Button } from "@/components/ui/button";
import useAuthUser from "@/hooks/use-auth-user";
import { toast } from "sonner";
import { getUrl, uploadData } from "aws-amplify/storage";
import { handleUpdateProfile } from "@/lib/cognitoActions";
import Loading from "@/components/shared/loading";

const ProfileSettings = () => {
  const user = useAuthUser();

  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [userName, setUserName] = useState<any>(user?.given_name);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (user?.given_name) {
      setUserName(user?.given_name);
    }
    if (user?.picture) {
      if (
        //   FOR DEFAULT PROFILE PICTURE
        user?.picture ===
        "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
      ) {
        setImageSrc(user.picture);
      } else {
        if (user.identities && !user.picture.startsWith("profile-pictures/")) {
          const userProfile = user.picture;
          setImageSrc(userProfile);
        } else {
          const userProfile = await getUrl({
            path: user.picture,
            options: {
              validateObjectExistence: false,
              expiresIn: 900,
              useAccelerateEndpoint: false,
            },
          });

          setImageSrc(userProfile?.url?.href);
        }
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      try {
        setIsUploading(true);
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
        setUploadedImage(result?.path);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        setIsUploading(false);
        toast.error("Error uploading profile picture");
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error("Please select an image file (png, jpg, jpeg)");
    }
  };

  const handleSubmit = async () => {
    if (!userName) {
      return toast.error("Please enter a name");
    }

    if (userName === user?.given_name && !uploadedImage) {
      return;
    }

    try {
      setIsLoading(true);
      await handleUpdateProfile(undefined, {
        fullName: userName,
        profilePic: uploadedImage,
      });
      return toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    await fetchData();
  };

  return (
    <SettingsCard>
      <div className="flex flex-col gap-8 max-w-[550px]">
        <h2 className="text-text-primary font-bold text-2xl">
          Profile Settings
        </h2>
        {/*  Profile Change Section */}
        <div className="flex  items-center  gap-4">
          <div className="w-[120px] h-[120px] relative">
            <Image
              src={
                imageSrc
                  ? imageSrc.toString()
                  : "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
              }
              alt="Profile"
              className="w-full h-full object-cover object-center rounded-full"
              fill
            />
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className="hidden"
            id="profilePicInput"
          />
          <label
            htmlFor="profilePicInput"
            className="cursor-pointer text-primary hover:text-primary/90 font-medium text-[14px] border-[1px] border-solid border-[#EAECF0] rounded-[8px] px-[12px] py-[20px] hover:bg-slate-100 transition-all "
          >
            {isUploading ? "Uploading..." : "Change Profile Pic"}
          </label>
        </div>
        {/*   Name change Section */}
        <div className="flex flex-col gap-2  mt-2">
          <label className="text-text-primary-foreground text-base font-bold">
            Name
          </label>
          <Input
            type="text"
            placeholder={userName}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        {/*  Buttons */}
        <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-2  justify-end">
          <Button
            variant="outline"
            className="px-[28px] py-[16px] sm:h-[56px] sm:w-[111px] font-bold"
            onClick={handleReset}
          >
            Cancel
          </Button>
          <Button
            className="px-[28px] py-[16px] btn-shadow sm:h-[56px] sm:w-[197px] font-bold "
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex gap-1">
                <Loading />
                Saving
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </SettingsCard>
  );
};

export default ProfileSettings;
