import { cn } from "@/lib/utils";
import React from "react";

const Loading = ({ className = "" }: { className?: string }) => {
  return (
    <span className="ml-1.5 flex items-center gap-1">
      <span
        className={cn(
          "animate-flashing w-1 h-1 bg-white rounded-full inline-block",
          className
        )}
      />
      <span
        className={cn(
          "animate-flashing delay-100 w-1 h-1 bg-white rounded-full inline-block",
          className
        )}
      />
      <span
        className={cn(
          "animate-flashing delay-100 w-1 h-1 bg-white rounded-full inline-block",
          className
        )}
      />
    </span>
  );
};

export default Loading;
