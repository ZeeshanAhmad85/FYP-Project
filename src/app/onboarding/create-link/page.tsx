import CreatePublicLink from "@/components/onboard/create-link";
import { getResumeById } from "@/data/data";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { resumeId } = searchParams;
  if (!resumeId || typeof resumeId !== "string") return notFound();

  const resume = await getResumeById(resumeId);
  if (!resume) return notFound();

  const resumeData = {
    id: resume?.id,
    title: resume?.title,
    userId: resume?.userId,
  };
  return <CreatePublicLink resume={resumeData} />;
};

export default Page;
