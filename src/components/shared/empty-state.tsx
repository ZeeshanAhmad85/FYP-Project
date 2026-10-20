import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const EmptyState = ({
  img = "/assets/dashboard/graph-empty.svg",
  text = "No data available",
  className,
}: {
  img?: string;
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center  text-text-primary-foreground h-[300px]",
        className
      )}
    >
      <div className="relative h-[105px] w-[152px]">
        <Image src={img} alt="search" fill />
      </div>
      <div>
        <p className="text-[14px] font-[500] text-text-quaternary mt-2">
          {text}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
