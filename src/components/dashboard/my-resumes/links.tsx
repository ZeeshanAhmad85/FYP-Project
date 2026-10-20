import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input-simple";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

interface LinksProps {
  linkTitle: string;
  publicLink: string;

  emailNotification: boolean;
  handleCopy: (link: string) => void;
}

const Links: React.FC<LinksProps> = ({
  linkTitle,

  publicLink,

  emailNotification,

  handleCopy,
}) => {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}${publicLink}`;

  const handleCopyModal = () => {
    handleCopy(link);
  };

  return (
    <div className="border border-[#D0D5DD] flex flex-col space-y-4 rounded-[8px] py-4 px-3">
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
          className={`text-[#344054] font-[500] bg-white text-[16px] `}
          disabled
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-[700] text-text-primary mb-2">
          Your Public Link
        </label>
        <div className="flex space-x-2 items-center w-full">
          <Input
            type="text"
            value={link}
            disabled
            className="border text-[16px] font-[500] border-[#D0D5DD] bg-[#EAECF0]"
          />
        </div>
        <div className="w-full  sm:gap-3 sm:mt-3 flex flex-col sm:flex-row items-center">
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-white px-4 !py-2 flex w-full items-center justify-center flex-1 space-x-2 text-[#667085] h-[56px] border-[#EAECF0] rounded-[8px] text-[14px] font-[500]"
            // onClick={handleCopy}
          >
            <Image
              src="/assets/svg/stats.svg"
              alt="stats"
              width={24}
              height={24}
              priority
            />
            <span>Stats</span>
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            className="bg-white px-4 !py-2 flex w-full items-center justify-center flex-1 space-x-2 text-[#667085] h-[56px] border-[#EAECF0] rounded-[8px] text-[14px] font-[500]"
            onClick={handleCopyModal}
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
  );
};

export default Links;
