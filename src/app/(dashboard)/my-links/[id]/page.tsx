import StatsPage from "@/components/dashboard/my-links/stats-page";
import { getLinkTitleById } from "@/data/data";
// import { redirectLink } from "@/functions/redirectLink";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

const Page = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  const link = await getLinkTitleById(id);

  if (!link) {
    return notFound();
  }

  return (
    <Suspense fallback="loading...">
      <StatsPage linkTitle={link?.title} id={id} />
    </Suspense>
  );
};

export default Page;
