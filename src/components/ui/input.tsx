import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full font-[500] rounded-md border border-input bg-background px-3 py-6 text-sm ring-offset-input file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder transition duration-200 ease-in-out focus:border-[#356CB5] focus:outline-none focus:ring-1 focus:ring-[#356CB5] disabled:cursor-not-allowed  disabled:text-text-placeholder ",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
