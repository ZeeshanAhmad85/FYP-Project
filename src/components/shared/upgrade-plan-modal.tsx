import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ModalProps {
  onClose?: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const UpgradeModal: React.FC<ModalProps> = ({ onClose }) => {
  const router = useRouter();

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  const handleUpgradeClick = () => {
    router.push("/my-plans");
  };

  return (
    <motion.div
      className="fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50 h-full w-full"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white sm:w-[512px] overflow-hidden sm:h-[280px] sm:max-w-[512px] flex flex-col p-6 rounded-[8px]"
        style={{ boxShadow: "0px 4px 6px -2px #10182808" }}
        variants={modalVariants}
      >
        <div className="flex justify-end w-full ">
          <button
            className="bg-[#EAECF0] rounded-[8px] p-2 cursor-pointer"
            onClick={handleCloseModal}
          >
            <Image src="/assets/cross.svg" alt="" width={16} height={16} />
          </button>
        </div>

        <div className="flex flex-col items-start">
          <div className="border border-[#EAECF0] mt-[-1.5rem] rounded-[8px] block p-2">
            <Image
              src="/assets/onboard/upgrade.svg"
              width={40}
              height={40}
              alt=""
            />
          </div>

          <div className="w-full flex flex-col pt-4 pb-0">
            <h2 className="text-[20px] font-[700] text-[#344054] mb-2">
              Upgrade Your Plan
            </h2>
            <p className="text-[14px] text-text-quaternary">
              Upgrade your plan to customize your URL and access detailed resume
              statistics.
            </p>
          </div>
          <div className="w-full mt-2 pb-4">
            <div className="flex space-x-5 pt-6 pb-4 w-full">
              <Button
                className="bg-white flex flex-1 hover:bg-[#ECEFF1] border border-[#D0D5DD] text-[#344054] text-[14px] font-[500] p-2 rounded-[8px]"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-[#4082DA] flex flex-1 text-white text-[14px] font-[500] p-2 rounded-[8px]"
                onClick={handleUpgradeClick}
              >
                Upgrade to unlock
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpgradeModal;
