"use client";
import { useResetContext } from "@/context/reset-context";
import React, { useEffect } from "react";
import EnterCode from "./enter-code";
import CreateNewPassword from "./create-new-password";

const ResetPassword = ({ email }: { email: string }) => {
  const { step, setFormData } = useResetContext();

  useEffect(() => {
    setFormData({ email, password: "", otp: "" });
  }, [email, setFormData]);

  return (
    <>
      {step === 1 && <EnterCode />}
      {step === 2 && <CreateNewPassword />}
    </>
  );
};

export default ResetPassword;
