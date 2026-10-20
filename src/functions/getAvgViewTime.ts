import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const getAvgViewTime = async (userid: string) => {
  const { data, errors } = await client.models.Resume.listResumeByUserId(
    {
      userId: userid,
    },
    {
      selectionSet: ["links.sessions.duration"],
    }
  );

  if (errors) {
    console.log(errors, "getAverage VIEWSERROR");
  }

  let totalDuration = 0;
  let count = 0;
  data.forEach((item) => {
    item.links.forEach((link) => {
      link.sessions.forEach((session) => {
        if (session.duration !== null) {
          totalDuration += session.duration;
          count++;
        }
      });
    });
  });

  const averageDuration = count > 0 ? totalDuration / count : 0;
  console.log(
    " Average: ",
    averageDuration,
    " , count: ",
    count,
    " ,totalDuration: ",
    totalDuration
  );

  return averageDuration;
};
