import { defineFunction, secret } from "@aws-amplify/backend";

export const redirectLink = defineFunction({
  name: "redirectLink",
  entry: "./handler.ts",
  environment: {
    API_KEY: secret("redirect-api-key-rezlinks"),
  },
});
