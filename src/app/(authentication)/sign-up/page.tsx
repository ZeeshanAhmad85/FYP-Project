"use client";
import CreatePassword from "@/components/authentication/sign-up/create-password";
import GetStarted from "@/components/authentication/sign-up/get-started";
import { useSignupContext } from "@/context/signup-context";
import React from "react";

const Page = () => {
  const { step } = useSignupContext();

  return (
    <>
      {step === 1 && <GetStarted />}
      {step === 2 && <CreatePassword />}
    </>
  );
};

export default Page;
