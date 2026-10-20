import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn, validateEmail } from "@/lib/utils";
import Image from "next/image";

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
  const [emailError, setEmailError] = useState("");

  const handleChange = (value: string) => {
    onChange && onChange(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleBlur = () => {
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const getBorderColor = () => {
    if (emailError) {
      return "border-red-500 ring-red-500 ring-1 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 ";
    }

    return "border-input ";
  };

  return (
    <div className={className}>
      <div className="relative w-full">
        <Input
          type="email"
          placeholder={placeholder || "Email Address"}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`border ${getBorderColor()} pr-[35px]`}
          disabled={disabled}
        />
        <span
          className={cn(
            "absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer ",
            emailError ? "opacity-1" : "opacity-0"
          )}
        >
          <Image src={"/assets/error.svg"} alt="error" width={20} height={20} />
        </span>
      </div>
      <span
        className={cn(
          "text-red-500 text-sm h-5",
          "opacity-0",
          emailError && "opacity-1"
        )}
      >
        {emailError}
      </span>
    </div>
  );
};

export default EmailInput;
