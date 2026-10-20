import { cn } from "@/lib/utils";
import React from "react";

const SettingsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "p-[16px] sm:p-[24px] rounded-[8px] border-[1px] border-solid border-text-border max-w-full 3xl:max-w-[70%]  ",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SettingsCard;
