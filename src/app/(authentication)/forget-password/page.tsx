"use client";
import SimpleLayout from "@/components/authentication/simple-Layout";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EmailInput from "@/components/authentication/email-input";
import { validateEmail } from "@/lib/utils";
import { toast } from "sonner";
import { handleResetPassword } from "@/lib/cognitoActions";
import Loading from "@/components/shared/loading";
import { Link } from "react-transition-progress/next";
import { emailChecker } from "@/data/data";

const Page = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return toast.error("Error in Email", {
        description: "Please enter a valid email address",
      });
    }

    try {
      setIsLoading(true);
      const emailCheck = await emailChecker(email);

      if (!emailCheck) {
        toast.error("Email not registered", {
          description: "Email not found",
        });
        setIsLoading(false);

        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error during Email Verification", {
        description: `${error}`,
      });
    }

    try {
      setIsLoading(true);
      await handleResetPassword(undefined, email);
      toast.success("Reset Password Instructions Sent", {
        description:
          "We have sent you an email with instructions to reset your password.",
      });
      router.push(`/reset-password?email=${email}`);
    } catch (error: any) {
      toast.error("Error during Reset Password", {
        description: error?.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimpleLayout showButton={true} onClick={() => router.push("/login")}>
      {" "}
      <form
        className="flex flex-col space-y-10 max-w-[450px]"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold text-text-primary-foreground text-center">
            Forgot Password
          </h2>
          <span className="text-text-quaternary text-sm font-normal text-center">
            Enter the email address attached to your account so that we can send
            you the code to reset the password.
          </span>
        </div>
        <div className="flex flex-col space-y-[6px]  w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Email Address
          </label>

          <EmailInput
            onChange={(value) => setEmail(value)}
            value={email}
            placeholder="Enter your email address"
          />
          <Link
            className="text-text-primary-foreground text-sm font-medium cursor-pointer underline"
            href={"/login"}
          >
            Wait, I remember my password
          </Link>
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
              <span>Sending</span>
            </span>
          ) : (
            "Send Reset Instructions"
          )}
        </Button>
      </form>
    </SimpleLayout>
  );
};

export default Page;
