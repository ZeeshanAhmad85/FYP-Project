"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import SimpleLayout from "../simple-Layout";
import { toast } from "sonner";
import {
  handleSendEmailVerificationCode,
} from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import { useResetContext } from "@/context/reset-context";
import { OtpField } from "../sign-up/otp-field";

const EnterCode = () => {
  const router = useRouter();
  const [otp, setOtp] = React.useState("");
  const { formData, setFormData, setStep } = useResetContext();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check OTP validation
    if (otp.length !== 6) {
      return toast.error("Error in OTP", {
        description: "Please enter a valid OTP",
      });
    }

    setFormData({ ...formData, otp });
    setStep(2);
  };
  const resendCodeHandler = async () => {
    const prevState = { message: "", errorMessage: "" };

    const updatedFormData = { email: formData?.email };

    try {
      const currentState = await handleSendEmailVerificationCode(
        prevState,
        updatedFormData
      );
      if (currentState.message) {
        toast.success("Success", {
          description: currentState.message,
        });
      } else if (currentState.errorMessage) {
        toast.error("Error", {
          description: currentState.errorMessage,
        });
      }
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "An unexpected error occurred",
      });
    }
  };
  return (
    <SimpleLayout
      showButton={true}
      onClick={() => router.push("/forget-password")}
    >
      <form className="flex flex-col space-y-8" onSubmit={submitHandler}>
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold text-text-primary-foreground text-center">
            Enter the code
          </h2>
          <span className="text-text-quaternary text-sm font-normal text-center">
            We just sent a 6 digit code to{" "}
            <span className="text-primary">
              {formData?.email ?? "your email"}
            </span>
            , enter it below
          </span>
        </div>

        <div className="flex flex-col space-y-1  w-full">
          <OtpField value={otp} setValue={setOtp} />
          <span className="text-text-quaternary text-sm font-normal text-start pt-6">
            Don’t see a code?
            <span
              className="text-primary underline cursor-pointer"
              onClick={resendCodeHandler}
            >
              {" "}
              Resend the code
            </span>
          </span>
        </div>
        <Button
          variant={"default"}
          size={"default"}
          className="flex gap-[6px] items-center"
        >
          Verify the Code
        </Button>
      </form>
    </SimpleLayout>
  );
};

export default EnterCode;
