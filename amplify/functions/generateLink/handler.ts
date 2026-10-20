import type { Schema } from "../../data/resource";
import { customAlphabet } from "nanoid";

export const handler: Schema["generateLink"]["functionHandler"] = async (
  event
) => {
  const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    10
  );
  const uniqueid = nanoid();
  
  return uniqueid;
};
