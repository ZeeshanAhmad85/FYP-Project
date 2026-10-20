import { defineAuth, secret } from "@aws-amplify/backend";
import { sendViewEmail } from "../functions/sendViewEmail/resource";
import { redirectLink } from "../functions/redirectLink/resource";
import { stripeCheckoutFunc } from "../functions/stripe-checkout/resource";
import { verifyEmail } from "../functions/verifyEmail/resource";

export const auth = defineAuth({
  loginWith: {
    email: true,
    //   ------------------------TBD-----------------------
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),

        scopes: ["email", "profile", "openid"],

        attributeMapping: {
          email: "email",
          givenName: "given_name",
          profilePicture: "picture",
        },
      },
      // facebook: {
      //   clientId: secret('FACEBOOK_CLIENT_ID'),
      //   clientSecret: secret('FACEBOOK_CLIENT_SECRET'),

      //   scopes: [ "profile", "openid"],

      //   attributeMapping: {
      //     //email: 'email',
      //     givenName: 'given_name'
      //   }
      // },
      callbackUrls: [
        "http://localhost:3000/social-signin",
        "https://rezlinks.com/social-signin",
      ],
      logoutUrls: ["http://localhost:3000/login", "https://rezlinks.com/login"],
    },
  },
  userAttributes: {
    fullname: {
      mutable: true,
      required: false,
    },
    profilePicture: {
      mutable: true,
      required: false,
    },
  },
  access: (allow) => [
    allow.resource(sendViewEmail).to(["getUser"]),
    allow.resource(redirectLink).to(["getUser"]),
    allow
      .resource(stripeCheckoutFunc)
      .to(["updateUserAttributes", "listUsers", "manageUsers", "getUser"]),
    allow.resource(verifyEmail).to(["listUsers"]),
  ],
});
