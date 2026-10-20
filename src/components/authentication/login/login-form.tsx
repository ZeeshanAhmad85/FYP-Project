"use client";
import AuthenticationLayout from "@/components/authentication/authentication-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "react-transition-progress/next";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import PasswordInput from "../password-input";
import EmailInput from "../email-input";
import { validatePassword } from "@/lib/utils";
import { handleSignIn } from "@/lib/cognitoActions";
import Loading from "@/components/shared/loading";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await fetchAuthSession();
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      return toast.error("Error in Email", {
        description: "Please enter a valid email address",
      });
    }

    // Check password validation
    if (!validatePassword(password)) {
      return toast.error("Error in Password", {
        description: "Please Enter a valid password.",
      });
    }

    const formData = {
      email: email,
      password: password,
    };

    setIsLoading(true);
    try {
      const redirectLink = await handleSignIn(undefined, formData);
      redirectLink && router.push(redirectLink);
      toast.success("Successfully Signed In", {
        duration: 2000,
      });
    } catch (err: any) {
      console.error("Error during login:", err);
      toast.error("Error during login", {
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithRedirect({ provider: "Google", options: {} });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      await signInWithRedirect({ provider: "Facebook", options: {} });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticationLayout>
      <div className="flex flex-col space-y-6 max-w-full w-full px-4 sm:px-0 sm:w-[450px] sm:max-w-[450px] justify-self-center   justify-center">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-text-primary text-center">
            Welcome Back!
          </h2>
          <p className="text-sm text-text-secondary font-normal text-center">
            Sign in to continue
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
            Sign in with Google
          </Button>
          {/* <Button
            variant={"outline"}
            size={"default"}
            className="flex gap-[6px] items-center"
            onClick={handleSignInWithFacebook}
          >
            <Image
              src="/assets/facebook.svg"
              alt="Google"
              width={"20"}
              height={"20"}
            />
            Sign in with Faceboook
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
          <EmailInput value={email} onChange={(value) => setEmail(value)} />
          <PasswordInput
            onChange={(value) => setPassword(value)}
            placeholder="Password"
            value={password}
            isLogin={true}
            showError={false}
          />
          <Link
            className="text-end text-primary text-sm  underline"
            href={"/forget-password"}
          >
            Forgot Password
          </Link>
          <Button
            variant={"default"}
            size={"default"}
            className="flex gap-[6px] ml-2 items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex gap-[6px]">
                <Loading />
                <span>Submitting</span>
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-text-placeholder text-[14px] font-normal px-4 text-center">
          {" Don’t have an account? "}
          <Link
            href={"/sign-up"}
            className="text-primary  font-medium underline"
          >
            {"Sign Up"}
          </Link>
        </p>
      </div>
    </AuthenticationLayout>
  );
};

export default LoginForm;
