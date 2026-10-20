"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import useAuthUser from "@/hooks/use-auth-user";
import { createLink, generateUniqueLink } from "@/data/data";
import Loading from "@/components/shared/loading";

interface CreateLinkModalProps {
  linkData: any;
  onClose: any;
}

function CreateLinkModal({ linkData, onClose }: CreateLinkModalProps) {
  const [linkTitle, setLinkTitle] = useState<string>("");
  const [linkTitleError, setLinkTitleError] = useState<string>("");
  const [publicLink, setPublicLink] = useState<string>("");
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [selectedResume, setSelectedResume] = useState<string>(linkData?.title);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loadingLink, setLoadingLink] = useState(false);

  const [userName, setUserName] = useState<string | null>("");

  const [generatedLink, setGeneratedLink] = useState<any | null>(null);
  const [storePublicLink, setStorePublicLink] = useState("");

  const [regenerate, setRegenerate] = useState(false);

  const user = useAuthUser();

  const [linkPublished, setLinkPublished] = useState("");

  const SUBSCRIPTION = user?.[`custom:subscription`];
  useEffect(() => {
    //  Generate Link
    const generateLink = async () => {
      try {
        setLoadingLink(true);
        const link = await generateUniqueLink();
        let publicLinkForResume;
        let storePublicLinkForResume;
        //  <---------------------Link GENERATION LOGIC-------------------------->
        if (SUBSCRIPTION !== "PRO") {
          publicLinkForResume = `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${link}`;
          storePublicLinkForResume = `/resume/${link}`;
          setPublicLink(publicLinkForResume);
          setStorePublicLink(storePublicLinkForResume);
        } else if (SUBSCRIPTION === "PRO") {
          fetchUserName();
          //   INCASE USERNAME NOT FOUND EVEN PRO
          if (userName) {
            publicLinkForResume = `${process.env.NEXT_PUBLIC_BASE_URL}/${userName}/${link}`;
            storePublicLinkForResume = `/${userName}/${link}`;
          } else {
            publicLinkForResume = `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${link}`;
            storePublicLinkForResume = `/resume/${link}`;
          }
          setPublicLink(publicLinkForResume);
          setStorePublicLink(storePublicLinkForResume);
        }

        setGeneratedLink(link);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setLoadingLink(false);
      }
    };
    //  FETCH USER NAME

    const fetchUserName = async () => {
      if (user) {
        // Fetch user information or get from local storage
        const normalizedUserName = user?.given_name
          ?.toLowerCase()
          .replace(/\s+/g, "");
        setUserName(normalizedUserName);
      } else {
        const storedName = localStorage
          .getItem("Name")
          ?.toLowerCase()
          .replace(/\s+/g, "");

        if (storedName) {
          setUserName(storedName);
        }
      }
    };

    generateLink();
  }, [user, userName, SUBSCRIPTION, regenerate]);

  const handlePublishLink = async () => {
    if (!linkTitle.trim()) {
      setLinkTitleError("Link Title is required.");
      return;
    }
    if (linkPublished === publicLink) {
      return toast.error("Link is already published", {
        description:
          "This link is already published. Please create a new link to publish.",
      });
    }

    try {
      setIsLoading(true);
      await createLink({
        userId: linkData?.userId,
        resumeId: linkData?.id,
        title: linkTitle,
        url: storePublicLink,
        emailNotification,
      });
      toast.success("Link published successfully!");
      onClose(publicLink);
      //    <------------------------------LOGIC FOR NOT PUBLISHING THE SAME LINK AGAIN-------------------->
      if (SUBSCRIPTION !== "PRO") {
        setLinkPublished(
          `${process.env.NEXT_PUBLIC_BASE_URL}/resume/${generatedLink}`
        );
      } else if (SUBSCRIPTION === "PRO") {
        setLinkPublished(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${userName}/${generatedLink}`
        );
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link. Please try again.");
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
        <div
          className={`bg-[#F7F7F7] z-[99999] sm:w-[600px] my-6 overflow-hidden sm:max-w-[600px] flex flex-col p-6 rounded-[8px]`}
          style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
        >
          <div className="flex flex-col w-full mb-4">
            <div className="flex justify-end w-full">
              <button
                className="bg-[#EAECF0] rounded-[8px] p-2 cursor-pointer"
                onClick={onClose}
              >
                <Image src="/assets/cross.svg" alt="" width={16} height={16} />
              </button>
            </div>
            <h1 className="text-[24px] text-center text-text-primary font-[700]">
              Create Link
            </h1>
          </div>

          <div className="flex flex-col space-y-6 w-full">
            <div className="w-full">
              <label
                htmlFor="resumetitle"
                className="block text-sm font-[700] text-text-primary mb-2"
              >
                Resume
              </label>
              <div className="flex-1 w-full">
                <Select
                  value={selectedResume}
                  onValueChange={setSelectedResume}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Resume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={linkData?.title}>
                      {linkData?.title}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-[#D0D5DD] flex flex-col space-y-4 border rounded-[8px] p-3">
              <div className="w-full">
                <label
                  htmlFor="linkTitle"
                  className="block text-sm font-[700] text-text-primary mb-2"
                >
                  Link Title
                </label>
                <Input
                  type="text"
                  placeholder="Link title"
                  value={linkTitle}
                  onChange={(e) => {
                    setLinkTitle(e.target.value);
                    if (e.target.value.trim()) {
                      setLinkTitleError("");
                    }
                  }}
                  className={`text-[#344054] font-[500] bg-white text-[16px] ${
                    linkTitleError ? "border-error border-2" : ""
                  }`}
                />
                {linkTitleError && (
                  <p className="text-error text-sm mt-1">{linkTitleError}</p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-[700] text-text-primary mb-2">
                  Your Public Link
                </label>
                <div className="flex space-x-2 items-center w-full">
                  <Input
                    type="text"
                    value={loadingLink ? "Generating..." : publicLink}
                    disabled
                    className="border text-[16px] font-[500] border-[#D0D5DD] bg-[#EAECF0]"
                  />
                </div>
              </div>
              <div className="w-full  sm:gap-3 mt-3   flex flex-col sm:flex-row">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="group  bg-white px-4 !py-2 flex w-full items-center justify-center flex-1 space-x-2 text-[#667085] h-[56px] border-[#EAECF0] rounded-[8px] text-[14px] font-[500]  "
                  onClick={() => setRegenerate(!regenerate)}
                >
                  <Image
                    src="/assets/svg/regenerate.svg"
                    alt="Regenerate"
                    width={24}
                    height={24}
                    priority
                    className="group-hover:animate-spin"
                  />
                  <span>Regenerate</span>
                </Button>

                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="bg-white px-4 !py-2 flex w-full items-center justify-center flex-1 space-x-2 text-[#667085] h-[56px] border-[#EAECF0] rounded-[8px] text-[14px] font-[500]"
                  onClick={handleCopy}
                >
                  <Image
                    src="/assets/copy-2.svg"
                    alt="Copy"
                    width={24}
                    height={24}
                    priority
                  />
                  <span>Copy</span>
                </Button>
              </div>
              <div className="w-full flex items-center px-3 py-4 rounded-[8px] justify-between border border-[#D0D5DD] space-x-2">
                <label className="block text-[15px] font-[700] text-text-primary">
                  Email me when link is opened
                </label>
                <Switch
                  checked={emailNotification}
                  onCheckedChange={() =>
                    setEmailNotification(!emailNotification)
                  }
                  className={`${
                    emailNotification ? "bg-primary" : "bg-white"
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span
                    className={`${
                      emailNotification ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>
            <div className="w-full mt-2 flex flex-col space-y-4">
              <div className="w-full flex flex-col space-y-4">
                <Button
                  size={"default"}
                  onClick={handlePublishLink}
                  className="w-full py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex gap-1">
                      <Loading />
                      Publishing
                    </span>
                  ) : (
                    "Publish the Link"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLinkModal;
