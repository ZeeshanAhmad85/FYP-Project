'use client'
import VerifyEmail from "@/components/authentication/sign-up/verify-email";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = ({ searchParams }: PageProps) => {
  let { email } = searchParams;
  if (!email || typeof email !== "string") return notFound();

  let redirecturl = `/onboarding/basic-details`
  return <VerifyEmail emailParams={email} redirecturl= {redirecturl}/>;
};

export default page;
