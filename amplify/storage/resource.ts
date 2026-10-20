import { defineStorage } from "@aws-amplify/backend";
import { redirectLink } from "../functions/redirectLink/resource";

export const storage = defineStorage({
  name: "rezLinkStorage",
  access: (allow) => ({
    "profile-pictures/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],

    "resumes/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow.resource(redirectLink).to(["read"]),
    ],

    "heatmaps/*": [
      allow.guest.to(["read", "write", "delete"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],

    "thumbnails/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
