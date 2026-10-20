import { defineFunction } from "@aws-amplify/backend";

export const sendViewEmail = defineFunction({
  name: "sendViewEmail",
  entry: './handler.ts',
});