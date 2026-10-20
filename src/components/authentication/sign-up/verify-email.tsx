"use client";
import React from "react";
import { OtpField } from "./otp-field";
import { Button } from "@/components/ui/button";
import SimpleLayout from "../simple-Layout";
import { toast } from "sonner";
import {
  handleConfirmSignUp,
  handleSendEmailVerificationCode,
} from "@/lib/cognitoActions";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/loading";

const VerifyEmail = ({
  emailParams,
  redirecturl,
}: {
  emailParams: string;
  redirecturl: string;
}) => {
  const [otp, setOtp] = React.useState("");

  const router = useRouter();

  //   Loading And Error States
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check OTP validation
    if (otp.length !== 6) {
      return toast.error("Error in OTP", {
        description: "Please enter a valid OTP",
      });
    }

    // Call the API to verify the OTP
    setIsLoading(true);

    const otpForm = {
      email: emailParams,
      code: otp,
    };

    try {
      await handleConfirmSignUp(undefined, otpForm);
      toast.success("Success", {
        description: "Account verified successfully",
      });
      localStorage.setItem("confetti", "true");
      // Clear the onboarded cookie
      localStorage.removeItem("onboarded");
      router.push(redirecturl);
    } catch (err: any) {
      console.error("Error during signup:", err);
      toast.error("Signup Error", {
        description: err?.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resendCodeHandler = async () => {
    const prevState = { message: "", errorMessage: "" };

    const formData = { email: emailParams };

    try {
      const currentState = await handleSendEmailVerificationCode(
        prevState,
        formData
      );
      setError(currentState.errorMessage);
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
    <SimpleLayout>
      <form className="flex flex-col space-y-8" onSubmit={submitHandler}>
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold text-text-primary-foreground text-center">
            Enter the code
          </h2>
          <span className="text-text-quaternary text-sm font-normal text-center">
            We just sent a 6 digit code to{" "}
            <span className="text-primary">{emailParams ?? "your email"}</span>,
            enter it below
          </span>
        </div>
        {/* <div className="flex flex-col space-y-1  w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Email
          </label>
          <EmailInput value={email} onChange={setEmail} />
        </div> */}
        <div className="flex flex-col space-y-1  w-full">
          <OtpField value={otp} setValue={setOtp} />
          <span className="text-text-quaternary text-sm font-normal text-start pt-6">
            {" Don’t see a code? "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={resendCodeHandler}
            >
              Resend the code
            </span>
          </span>
        </div>
        <Button
          variant={"default"}
          size={"default"}
          className="flex gap-[6px] items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex gap-[6px]">
              <Loading />
              <span>Verifying</span>
            </span>
          ) : (
            "Verify "
          )}
        </Button>
      </form>
    </SimpleLayout>
  );
};

export default VerifyEmail;
