// components/PublicLinksModal.tsx
import React from "react";
import { Input } from "@/components/ui/input-simple";
import Image from "next/image";
import { toast } from "sonner";
import Links from "./links";

const PublicLinksModal: React.FC<any> = ({ onClose, links, title }) => {
  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link. Please try again.");
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-40 h-full  flex items-center justify-center bg-black bg-opacity-50  w-full">
      <div className="bg-[#F7F7F7] h-full   z-[99999] overflow-y-auto sm:w-[600px] my-6 overflow-x-hidden sm:max-w-[600px] flex flex-col py-6 px-8 rounded-[8px] shadow-md">
        <div className="flex w-full justify-end">
          <button
            className="bg-[#EAECF0] flex items-center justify-center rounded-[8px] py-3 px-3 cursor-pointer"
            onClick={onClose}
          >
            <Image src="/assets/cross.svg" alt="Close" width={16} height={16} />
          </button>
        </div>

        <div className="mb-6 mt-[-1.4rem] text-center">
          <h1 className="text-[24px] text-text-primary font-[700] mb-[4px]">
            My Public Links
          </h1>
          <p className="text-[#667085] text-[14px]">
            Manage public links for your resume
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
            <Input
              type="text"
              value={title}
              disabled
              className="border text-[16px] font-[500] border-[#D0D5DD] bg-[#EAECF0]"
            />
          </div>

          {links.length === 0 ? (
            <div className="flex flex-col gap-3 justify-center items-center h-full ">
              <div className="flex  justify-center items-center h-full ">
                <Image
                  src="/assets/myresume/link-empty.svg"
                  alt="Empty"
                  width={200}
                  height={300}
                />
              </div>
              <p className="text-[16px] font-[500] text-text-quaternary ">
                No Link Found for your resume
              </p>
            </div>
          ) : (
            links.map((link: any, index: any) => (
              <Links
                key={index}
                linkTitle={link.title}
                publicLink={link.url}
                emailNotification={link.sendmail}
                handleCopy={handleCopy}
              />
            ))
          )}
          {/* <div className="w-full flex flex-col space-y-4">
            <Button
              size={"default"}
              onClick={handlePublishLink}
              className="w-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish the Link"}
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PublicLinksModal;
