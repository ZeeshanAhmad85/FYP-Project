"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSignupContext } from "@/context/signup-context";
import Image from "next/image";
import AuthenticationLayout from "../authentication-layout";
import PasswordInput from "../password-input";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/lib/cognitoActions";
import Loading from "@/components/shared/loading";
import { Input } from "@/components/ui/input";

const CreatePassword = () => {
  const { formData, setStep } = useSignupContext();
  const router = useRouter();

  // validated states
  const [numberValidated, setNumberValidated] = useState(false);
  const [specialValidated, setSpecialValidated] = useState(false);
  const [lengthValidated, setLengthValidated] = useState(false);
  const [password, setPassword] = useState("");

  //    ERROR STATES AND LOADING STATES
  const [isLoading, setIsLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (value: string, type: string) => {
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#$%^&*\\-/,\\\\])");
    const length = new RegExp("(?=.{8,})");
    if (type === "password") {
      setPassword(value);
    } else if (type === "confirm-password") {
      setConfirmPassword(value);
    }

    setNumberValidated(number.test(value));
    setSpecialValidated(special.test(value));
    setLengthValidated(length.test(value));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmPassword !== password) {
      return toast.error("Error in Password", {
        description: "Password and Confirm Password must be same",
      });
    }

    let error = "Password must be at least";
    if (!lengthValidated) {
      error += " 8 characters long\n";
    }
    if (!numberValidated) {
      error += " one number\n";
    }
    if (!specialValidated) {
      error += " one special character\n";
    }
    if (error !== "Password must be at least") {
      return toast.error("Error in Password", {
        description: error,
      });
    }

    // Update formData with the password
    const updatedFormData = {
      ...formData,
      password: password,
    };

    setIsLoading(true);

    try {
      await handleSignUp(undefined, updatedFormData);
      router.push(
        `/confirm-signup?${
          updatedFormData?.email ? `email=${updatedFormData.email}` : ""
        }`
      );
      toast.success("Signup Successful", {
        description: "Please check your email for the confirmation code",
        duration: 2000,
      });
    } catch (err: any) {
      if (err.message.includes("User already exists")) {
        return toast.error("Please Login ", {
          description: err.message || "User already exists",
        });
      }
      console.error("Error during signup:", err);
      toast.error("Signup Error", {
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticationLayout>
      <form
        className="flex flex-col space-y-6 items-center max-w-full w-full px-4 sm:px-0 sm:max-w-[450px] sm:w-[450px] justify-self-center h-full  justify-center"
        onSubmit={submitHandler}
      >
        <h2 className="text-2xl font-bold text-text-primary">
          Create your Password
        </h2>
        <div className="flex flex-col space-y-1 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Email
          </label>
          {/*    CUTSOM COMPONENT */}
          <Input
            value={formData?.email!}
            className="w-full border-[1px] border-solid border-[#D0D5DD] rounded-[8px] bg-[#EAECF0]"
            disabled={true}
          />
        </div>
        <div className="flex flex-col space-y-1 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Password
          </label>
          {/*    CUTSOM COMPONENT */}
          <PasswordInput
            onChange={(value) => handleChange(value, "password")}
            value={password}
            placeholder="Enter the password"
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-1 items-start w-full">
          <label className="text-sm font-bold text-text-primary-foreground text-start">
            Confirm Password
          </label>

          <PasswordInput
            onChange={(value) => handleChange(value, "confirm-password")}
            placeholder="Re-enter the password"
            value={confirmPassword}
          />
        </div>
        <div className="flex flex-col space-y-2 items-start w-full">
          <div className="flex gap-2 items-center">
            {lengthValidated ? (
              <Image
                src={"/assets/check-circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src={"/assets/circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            )}
            <span className="text-text-tertiary text-base font-medium">
              Minimum 8 Characters
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {numberValidated ? (
              <Image
                src={"/assets/check-circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src={"/assets/circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            )}
            <span className="text-text-tertiary text-base font-medium">
              At least 1 number
            </span>
          </div>
          <div className="flex gap-2 items-center">
            {specialValidated ? (
              <Image
                src={"/assets/check-circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src={"/assets/circle.svg"}
                alt="check"
                width={24}
                height={24}
              />
            )}
            <span className="text-text-tertiary text-base font-medium">
              At least 1 symbol ( -,/,\)
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[6px] w-full">
          <Button
            variant={"default"}
            size={"default"}
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <span className="flex gap-[6px]">
                <Loading />
                <span>Submitting</span>
              </span>
            ) : (
              "Sign up"
            )}
          </Button>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => setStep(1)}
          >
            Back
          </Button>
        </div>
      </form>
    </AuthenticationLayout>
  );
};

export default CreatePassword;
