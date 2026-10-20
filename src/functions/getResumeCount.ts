import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const getResumeCount = async (userid: string) => {
  const { data, errors } = await client.models.Resume.listResumeByUserId({
    userId: userid,
  });

  if (errors) {
    console.log(errors, "getResumeCountERROR");
    throw new Error(errors[0].message);
  }

  const count = data.length;

  return count;
};
