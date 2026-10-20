import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn, validatePassword } from "@/lib/utils";
import { Input } from "../ui/input";

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  isLogin = false,
  showError = true,
}) => {
  const [typePassword, setTypePassword] = useState("password");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (value: string) => {
    onChange && onChange(value);
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleBlur = () => {
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include number, and special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const getBorderColor = () => {
    if (passwordError && showError) {
      return "border-red-500 ring-red-500 ring-1 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 ";
    }
    // if (validatePassword(value) && showError) {
    //   return "border-primary ring-primary ring-1";
    // }
    return "border-input";
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <Input
          type={typePassword}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter the password"}
          className={`border ${getBorderColor()} pr-[35px] ${className}`}
        />
        <span
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={() =>
            setTypePassword(typePassword === "password" ? "text" : "password")
          }
        >
          {typePassword === "password" ? (
            <EyeOff
              className={cn("w-5 h-5 text-text-placeholder bg-background", {
                "text-red-500": passwordError && showError,
              })}
            />
          ) : (
            <Eye
              className={cn("w-5 h-5 text-text-placeholder bg-background", {
                "text-red-500": passwordError && showError,
              })}
            />
          )}
        </span>
      </div>
      {!isLogin && (
        <span
          className={cn(
            "text-red-500 text-sm h-5",
            "opacity-0",
            passwordError && "opacity-1"
          )}
        >
          {passwordError}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;
