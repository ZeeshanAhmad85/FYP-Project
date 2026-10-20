import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const SimpleLayout = ({
  children,
  className,
  showButton = false,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  showButton?: boolean;
  onClick?: () => void;
}>) => {
  return (
    <section
      className={
        "max-w-[1400px] mx-auto  px-4 md:px-8 flex flex-col min-h-screen"
      }
    >
      <div className="flex justify-center py-4">
        <div className="relative w-[135px] h-[43px] justify-self-start">
          <Image src="/assets/logo-new.svg" alt="Logo" fill />
        </div>
      </div>
      {showButton && (
        <div className="px-0 sm:px-10 py-5">
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={onClick}
          >
            <Image
              src={"/assets/dashboard/back.svg"}
              alt="Arrow"
              width={24}
              height={24}
            />
            <span className="text-[16px] font-medium text-text-primary">
              Back
            </span>
          </button>
        </div>
      )}
      <div
        className={cn("flex justify-center items-center  flex-1 ", className)}
      >
        {children}
      </div>
    </section>
  );
};

export default SimpleLayout;
