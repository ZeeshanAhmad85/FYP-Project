"use client";
import { Button } from "@/components/ui/button";
import { useSignupContext } from "@/context/signup-context";
import Image from "next/image";
// import Link from "next/link";
import { Link } from "react-transition-progress/next";
import { useState } from "react";
import { toast } from "sonner";
import AuthenticationLayout from "../authentication-layout";
import EmailInput from "../email-input";
import { useRouter } from "next/navigation";
import { signInWithRedirect } from "aws-amplify/auth";

function GetStarted() {
  const { setStep, setFormData } = useSignupContext();

  const [email, setEmail] = useState("");

  const router = useRouter();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      toast.error("Error in Email", {
        description: "Please enter a valid email address",
      });
    } else {
      setFormData({ email });

      setStep(2);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col space-y-6 max-w-full px-4 sm:px-0 sm:max-w-[450px] justify-self-center   justify-center">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-text-primary text-center">
            Sign up to get started
          </h2>
          <p className="text-sm text-text-secondary font-normal text-center">
            Track how recruiters interact with your Resumes
          </p>
        </div>
        {/*   Buttons  */}
        <div className="flex flex-col space-y-2">
          <Button
            variant={"outline"}
            size={"default"}
            className="flex gap-[6px] items-center"
            onClick={handleSignInWithGoogle}
          >
            <Image
              src="/assets/google.svg"
              alt="Google"
              width={"20"}
              height={"20"}
            />
            Sign up with Google
          </Button>
          {/* <Button
            variant={"outline"}
            size={"default"}
            className="flex gap-[6px] items-center"
          >
            <Image
              src="/assets/facebook.svg"
              alt="Google"
              width={"20"}
              height={"20"}
            />
            Sign up with Faceboook
          </Button> */}
        </div>
        <div className="grid grid-cols-7 gap-1 place items-center">
          <span className="bg-[#EAECF0] h-[1px] col-span-3"></span>
          <span className="text-base font-normal text-center text-text-placeholder col-span-1">
            OR
          </span>
          <span className="bg-[#EAECF0] h-[1px] col-span-3"></span>
        </div>
        <form className="flex flex-col space-y-2" onSubmit={submitHandler}>
          <EmailInput value={email} onChange={setEmail} />
          <Button
            variant={"default"}
            size={"default"}
            className="flex gap-[6px] items-center"
          >
            Continue with email
          </Button>
          <p className="text-text-placeholder text-[14px] font-medium  text-center">
            By clicking the button above, you agree to our{" "}
            <Link href={"/"} className="text-primary font-medium underline">
              Terms of use{" "}
            </Link>
            and{" "}
            <Link href={"/"} className="text-primary font-medium underline">
              {" "}
              Privacy Policies.
            </Link>
          </p>
        </form>

        <p className="text-text-placeholder text-[14px] font-normal px-4 text-center">
          {"Already have an account? "}
          <Link href={"/login"} className="text-primary font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthenticationLayout>
  );
}

export default GetStarted;
