"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupContextType["formData"]>({
    email: "",
    password: "",
  });

  return (
    <SignupContext.Provider value={{ step, setStep, formData, setFormData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignupContext = () => {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error("useSignupContext must be used within a SignupProvider");
  }
  return context;
};
