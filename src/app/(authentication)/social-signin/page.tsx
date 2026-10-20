"use client";

import VerifyEmail from "@/components/authentication/sign-up/verify-email";
import React from "react";

import "aws-amplify/auth/enable-oauth-listener";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Loader2 } from "lucide-react";

let email = "";

Hub.listen("auth", async ({ payload }) => {
  switch (payload.event) {
    case "signInWithRedirect":
      const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      email = userAttributes.email ? userAttributes.email : "";
      window.location.reload();
      break;
    case "signInWithRedirect_failure":
      console.log("signinwithredirectfailed", payload);
      break;
    case "customOAuthState":
      const state = payload.data;
      break;
  }
});
const page = ({ searchParams }: PageProps) => {
  let { code } = searchParams;

  if (!code || typeof code !== "string" || email === "")
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Logging you in...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  let redirecturl = `/overview`;
  return <VerifyEmail emailParams={email} redirecturl={redirecturl} />;
};

export default page;
