import PdfViewerPublic from "@/components/shared/pdf-viewer-public";
import { getLinkById } from "@/data/data";
import { notFound } from "next/navigation";
import React from "react";
import { Amplify } from "aws-amplify";
import output from "../../../../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";

Amplify.configure(output);
const client = generateClient<Schema>({
  authMode: "apiKey",
  // authMode: "apiKey",
});

const Page = async ({
  params,
}: {
  params: {
    resume: string;
    id: string;
  };
}) => {
  const { resume, id } = params;

  const { data: redirectiondata, errors: redirectionerrors } =
    await client?.queries?.redirectLink({
      linkurl: `/${resume}/${id}`,
    });

  if (redirectionerrors) {
  }

  let linkid = redirectiondata?.linkid;
  let resumeUrl = redirectiondata?.resume;
  let path = redirectiondata?.path;

  if (!linkid || !resumeUrl || !path) {
    return notFound();
  }

  const link = await getLinkById(linkid);

  if (!link) {
    return notFound();
  }

  if (!link.active) {
    return notFound();
  }

  return (
    <PdfViewerPublic
      resume={resumeUrl}
      linkData={link}
      path={path}
      linkId={linkid}
      resumeId={link?.resumeId}
    />
  );
};

export default Page;
