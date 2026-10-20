"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

const ResetContext = createContext<ResetContextType | undefined>(undefined);

export const ResetProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ResetContextType["formData"]>({
    email: "",
    password: "",
    otp: "",
  });

  return (
    <ResetContext.Provider value={{ step, setStep, formData, setFormData }}>
      {children}
    </ResetContext.Provider>
  );
};

export const useResetContext = () => {
  const context = useContext(ResetContext);
  if (context === undefined) {
    throw new Error("useResetContext must be used within a ResetProvider");
  }
  return context;
};
