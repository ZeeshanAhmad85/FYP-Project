"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UpgradeBanner: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showNewIcon, setShowNewIcon] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isHovered) {
      timeout = setTimeout(() => setShowNewIcon(true), 100);
    } else {
      timeout = setTimeout(() => setShowNewIcon(false), 100);
    }

    return () => clearTimeout(timeout);
  }, [isHovered]);

  const handleUpgradeClick = () => {
    router.push("/my-plans");
  };

  return (
    <div className="flex relative overflow-hidden w-full items-center bg-[#68D2A6] text-text-primary-foreground px-5 sm:px-6 py-4 sm:py-2 rounded-[8px]">
      <Image
        src="/assets/banner-vector-1.svg"
        className="absolute top-0 left-[7%]"
        height={173}
        width={373}
        alt=""
      />
      <Image
        src="/assets/banner-vector-2.svg"
        className="absolute bottom-[-70px] right-0"
        height={173}
        width={373}
        alt=""
      />

      <div className="flex justify-between 3xll:justify-start items-center w-full z-10">
        <div className="relative hidden md:block h-[149px] w-[149px] mb-[-3.2rem] ml-[-1rem] 3xll:ml-[3rem]">
          <Image src="/assets/upgrade-rocket.svg" alt="" fill />
        </div>
        <div className="flex sm:justify-between sm:flex-row space-y-3 sm:space-y-0 flex-col sm:items-center w-full">
          <div className="3xll:w-full">
            <h2 className="text-[20px] font-[700] m-0">Upgrade to PRO</h2>
            <p className="m-0">
              Upgrade to pro to get more detailed statistics and ability to
              create custom links
            </p>
          </div>

          <div className="md:ml-[1.2rem] 3xll:w-[200px]">
            <button
              className="bg-[#FFFFFF80] hover:bg-[#edeaea9b] 3xll:w-full text-text-primary-foreground border-none hover:text-primary px-4 rounded-[8px] cursor-pointer flex justify-center items-center space-x-2 py-3 font-[500] transition duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleUpgradeClick} // Add click handler
            >
              <span>Upgrade now</span>
              <Image
                src={
                  showNewIcon ? "/assets/upgrade.svg" : "/assets/upgrade-2.svg"
                }
                alt=""
                height={24}
                width={24}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
