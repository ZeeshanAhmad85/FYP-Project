"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleUpdateOnboarding } from "@/lib/cognitoActions";
import Confetti from "react-dom-confetti";

interface ModalProps {
  icon: string;
  heading: string;
  subHead: string;
  isOnboarding: boolean;
  onClose?: () => void;
  publicLink: string;
  redirectToOverview?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  icon,
  heading,
  subHead,
  isOnboarding,
  onClose,
  redirectToOverview = false,
  publicLink: linkValue,
}) => {
  const [inputWidth, setInputWidth] = useState("auto");
  const inputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    return () => {
      setShowConfetti(false);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(`${inputRef?.current?.textContent?.length ?? 0 + 250}px`);
    }
  }, [inputWidth]);

  const handleCopyLink = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.textContent || "");
      toast.success("Link copied to clipboard");
    }
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose(); // Call the close function prop if provided
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
      <Confetti
        active={showConfetti}
        config={{ elementCount: 600, spread: 90 }}
      />
      <div
        className={`bg-white sm:w-[512px] overflow-hidden sm:h-[375px] sm:max-w-[512px] flex flex-col p-6 rounded-[8px] z-[1000]`}
        style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
      >
        {isOnboarding && (
          <div className="flex justify-end w-full ">
            <button
              className="bg-[#EAECF0] rounded-[8px] p-2 cursor-pointer"
              onClick={handleCloseModal}
            >
              <Image src="/assets/cross.svg" alt="" width={16} height={16} />
            </button>
          </div>
        )}
        <div className="flex flex-col items-start">
          <div className="border border-[#EAECF0] mt-[-1.5rem] rounded-[8px] block p-2">
            <Image src={icon} width={40} height={40} alt="" />
          </div>

          <div className="w-full flex flex-col pt-4 pb-0">
            <h2 className="text-[20px] font-[700] text-[#344054] mb-2">
              {heading}
            </h2>
            <p className="text-[14px] text-text-quaternary">{subHead}</p>
          </div>

          {isOnboarding ? (
            <div className="w-full mt-2">
              <span className="font-[500] text-[#667085] text-[14px]">
                Share link
              </span>
              <div className="flex items-center space-x-3 w-full mt-2">
                <div
                  ref={inputRef}
                  className="bg-white flex flex-1 py-3 border px-2 text-[16px] rounded-[8px] border-[#D0D5DD] text-text-quaternary overflow-hidden whitespace-nowrap text-overflow-ellipsis"
                  style={{ width: inputWidth }}
                >
                  {linkValue}
                </div>
                <Button
                  size={"default"}
                  className="bg-[#EAECF0] hover:bg-[#EAECF0] text-[#344054] font-[500] px-4 py-6 flex items-center"
                  onClick={handleCopyLink}
                >
                  <Image
                    src="/assets/copy-2.svg"
                    alt=""
                    height={20}
                    width={20}
                  />
                </Button>
              </div>
              <div className="flex space-x-5 pt-6 pb-4 w-full">
                <Button
                  className="bg-white flex flex-1 hover:bg-[#ECEFF1] border border-[#D0D5DD] text-[#344054] text-[14px] font-[500] p-2 rounded-[8px]"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-[#4082DA] flex flex-1 text-white text-[14px] font-[500] p-2 rounded-[8px]"
                  onClick={async () => {
                    !redirectToOverview && handleCloseModal();
                    window.open(linkValue, "_blank");
                    redirectToOverview && (await handleUpdateOnboarding());
                    redirectToOverview && router?.push("/overview");
                  }}
                >
                  Visit the link
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="bg-primary text-white text-[14px] font-[500] p-2 rounded-[8px]"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
