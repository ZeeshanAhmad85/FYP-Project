"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/shared/modal";
import useAuthUser from "@/hooks/use-auth-user";
import { createLink, generateUniqueLink } from "@/data/data";
import { toast } from "sonner";
import Loading from "../shared/loading";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";

const CreatePublicLink: React.FC<{ resume: any }> = ({ resume }) => {
  const router = useRouter();
  const user = useAuthUser();

  const [regenerate, setRegenerate] = useState(false);

  const SUBSCRIPTION =
    user?.[`custom:subscription`] || localStorage.getItem("Plan");

  const [linkTitle, setLinkTitle] = useState("");
  const [publicLink, setPublicLink] = useState("");
  const [storePublicLink, setStorePublicLink] = useState("");
  const [emailNotification, setEmailNotification] = useState(false);

  const [linkTitleError, setLinkTitleError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  //   NOW LOGIC FOR ONE LINK IS PUBLISHED ONCE THEN IS SHOULD NOT BE PUBLISHED AGAIN
  const [linkPublished, setLinkPublished] = useState<string | null>();

  //   Resume ID

  const [loadingLink, setLoadingLink] = useState(false);

  const [userName, setUserName] = useState<string | null>("");

  const [generatedLink, setGeneratedLink] = useState<any | null>(null);

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
        console.log(error, "ERROR");
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
    if (!linkTitle.trim() || linkTitle.length < 3 || linkTitle.length > 20) {
      setLinkTitleError(
        "Link Title is at least 3 characters long and at most 20 characters long"
      );
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
        userId: resume?.userId,
        resumeId: resume?.id,
        title: linkTitle,
        url: storePublicLink,
        emailNotification,
      });
      setShowModal(true);
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

  const closeModal = async () => {
    await handleUpdateOnboarding();
    router.push("/overview");
    setShowModal(false);
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
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex justify-between">
        <button
          onClick={async () => {
            await handleUpdateOnboarding();
            router?.push("/overview");
          }}
          className="text-[#344054] font-[500] pt-[4rem] flex item-center uppercase"
        >
          <Image src="/assets/svg/back.svg" height={24} width={24} alt="" />{" "}
          <span className="ml-2">back</span>
        </button>
        <button
          onClick={() => router?.push("/overview")}
          className="text-[#344054] font-[500] pt-[4rem] uppercase"
        >
          skip
        </button>
      </div>
      <div className="min-h-screen w-full lg:w-[70%] space-y-9 flex flex-col items-center px-4 py-[4rem]">
        <div>
          <h1 className="text-[24px] text-center text-text-primary font-[700] mb-[8px]">
            Create a Public Link
          </h1>
          <p className="text-center text-text-secondary">
            Public links help you track the interactions users have with your
            Resume
          </p>
        </div>
        <div className="flex flex-col space-y-8 w-full">
          <div className="w-full">
            <label
              htmlFor="resumetitle"
              className="block text-sm font-[700] text-text-primary mb-2"
            >
              Resume
            </label>
            <div className="flex-1 w-full">
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder={resume?.title} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={resume?.title}>{resume?.title}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
          </div>
          <div className="w-full flex items-center px-3 py-4 rounded-[8px] justify-between border border-[#D0D5DD] space-x-2">
            <label className="block text-[15px] font-[700] text-text-primary">
              Email me when link is opened
            </label>
            <Switch
              checked={emailNotification}
              onCheckedChange={() => setEmailNotification(!emailNotification)}
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

      {showModal && (
        <Modal
          icon={"/assets/tick.svg"}
          heading="Your link is ready to be shared."
          subHead="Copy the link below, share it with your recruiter, and start tracking your resume's progress."
          onClose={closeModal}
          isOnboarding={true}
          publicLink={publicLink}
          redirectToOverview={true}
        />
      )}
    </div>
  );
};

export default CreatePublicLink;
