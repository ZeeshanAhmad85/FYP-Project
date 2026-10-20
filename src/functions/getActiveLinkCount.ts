import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const getActiveLinkCount = async (userid: string) => {
  const { data, errors } = await client.models.Link.list({
    filter: {
      and: [
        {
          userId: { eq: userid },
        },
        {
          active: { eq: true },
        },
      ],
    },
  });

  if (errors) {
    console.log(errors, "getACTIVE LinkCountERROR");
  }

  const count = data.length;

  return count;
};
