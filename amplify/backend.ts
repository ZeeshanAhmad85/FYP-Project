import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { generateLink } from "./functions/generateLink/resource";
import { sendViewEmail } from "./functions/sendViewEmail/resource";

import * as iam from "aws-cdk-lib/aws-iam";

import { redirectLink } from "./functions/redirectLink/resource";
import { verifyEmail } from "./functions/verifyEmail/resource";
import { stripeCheckoutFunc } from "./functions/stripe-checkout/resource";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";

export const backend = defineBackend({
  auth,
  data,
  storage,
  generateLink,
  sendViewEmail,
  redirectLink,
  verifyEmail,
  stripeCheckoutFunc,
});

// override user pool password policies
backend.auth.resources.cfnResources.cfnUserPool.addPropertyOverride(
  "Policies",
  {
    PasswordPolicy: {
      MinimumLength: 8,
      RequireLowercase: false,
      RequireNumbers: true,
      RequireSymbols: true,
      RequireUppercase: false,
      TemporaryPasswordValidityDays: 30,
    },
  }
);

// update the schema property to add custom attributes
const { cfnUserPool } = backend.auth.resources.cfnResources;
if (Array.isArray(cfnUserPool.schema)) {
  cfnUserPool.schema.push({
    name: "subscription",
    attributeDataType: "String",
  });
}
if (Array.isArray(cfnUserPool.schema)) {
  cfnUserPool.schema.push({
    name: "credits",
    attributeDataType: "Number",
  });
}

if (Array.isArray(cfnUserPool.schema)) {
  cfnUserPool.schema.push({
    name: "onboarded",
    attributeDataType: "Boolean",
  });
}

//add email permission
const sesPolicyStatement = new iam.PolicyStatement({
  actions: ["ses:SendEmail", "ses:SendRawEmail"],
  resources: ["*"],
});

backend.sendViewEmail.resources.lambda.addToRolePolicy(sesPolicyStatement);

//create stripe webhook url
const stripeWebhookUrlObj =
  backend.stripeCheckoutFunc.resources.lambda.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
  });

backend.addOutput({
  custom: {
    stripeCheckoutFunc: stripeWebhookUrlObj.url,
  },
});

backend.stripeCheckoutFunc.resources.lambda.addToRolePolicy(
  new iam.PolicyStatement({
    actions: ["ses:SendEmail", "ses:SendRawEmail"],
    resources: ["*"],
  })
);
