import ResetPassword from "@/components/authentication/reset-password/reset";
import { notFound } from "next/navigation";
import React from "react";

const Page = ({
  searchParams,
}: {
  searchParams: { email: string | undefined };
}) => {
  const { email } = searchParams;

  if (!email || typeof email !== "string") return notFound();

  return <ResetPassword email={email} />;
};

export default Page;
