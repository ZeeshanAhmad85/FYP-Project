import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const getTotalDownloads = async (userid: string) => {
  const { data, errors } = await client.models.Resume.listResumeByUserId(
    {
      userId: userid,
    },
    {
      selectionSet: ["links.sessions.analytics.download"],
    }
  );

  if (errors) {
    console.log(errors, "get TOTAL DOWNLAOD COUNT ERROR");
  }

  let totalDownloadCount = 0;

  data.forEach((item) => {
    item.links.forEach((link) => {
      link.sessions.forEach((session) => {
        if (session.analytics && session.analytics.download) {
          session.analytics.download.forEach((download) => {
            if (download !== null) {
              totalDownloadCount += 1;
            }
          });
        }
      });
    });
  });

  return totalDownloadCount;
};
