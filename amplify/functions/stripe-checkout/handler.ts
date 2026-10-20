import { verifyWebhookSig } from "./helpers/verifyStripeWebhook";
import { env } from "$amplify/env/stripe-checkout";
import { sendHTMLEmail } from "../sendViewEmail/sendHTMLEmail";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ListUsersCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const user_pool_id = env.AMPLIFY_AUTH_USERPOOL_ID;
const client = new CognitoIdentityProviderClient();

const updateUserAttribute = async (
  email: string,
  attributeName: string,
  attributeValue: string
) => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: user_pool_id,
      Filter: `email = "${email}"`,
    });

    const response = await client.send(command);

    if (response.Users?.length === 0) {
      throw new Error("User not found");
    }

    const user = response.Users?.at(0);
    const userSub = user?.Attributes?.find(
      (attr) => attr.Name === "sub"
    )?.Value;

    if (userSub) {
      const updatecommand = new AdminUpdateUserAttributesCommand({
        UserPoolId: user_pool_id,
        Username: userSub,
        UserAttributes: [
          {
            Name: `custom:${attributeName}`,
            Value: attributeValue,
          },
        ],
      });

      const getcommand = new AdminGetUserCommand({
        UserPoolId: user_pool_id,
        Username: userSub,
      });

      const response = await client.send(updatecommand);

      const user = await client.send(getcommand);

      console.log("Subscription plan updated: ", response, user);
    }

    return "updated";
  } catch (err) {
    console.log(err, "ERROR UPDATING SUBSCRIPTION");
    throw Error("Subscription failed!");
  }
};

//   FOR ADDING CREDITS TO USER
const addCreditsToUser = async (email: string, creditsToAdd: number) => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: user_pool_id,
      Filter: `email = "${email}"`,
    });

    const response = await client.send(command);

    if (!response.Users || response.Users.length === 0) {
      throw new Error("User not found");
    }

    const user = response.Users[0];
    const userSub = user.Attributes?.find((attr) => attr.Name === "sub")?.Value;
    const currentCreditsAttr = user.Attributes?.find(
      (attr) => attr.Name === "custom:credits"
    )?.Value;

    const currentCredits = parseInt(currentCreditsAttr ?? "0", 10);
    const updatedCredits = currentCredits + creditsToAdd;

    if (userSub) {
      const updateCommand = new AdminUpdateUserAttributesCommand({
        UserPoolId: user_pool_id,
        Username: userSub,
        UserAttributes: [
          {
            Name: "custom:credits",
            Value: updatedCredits.toString(),
          },
        ],
      });

      await client.send(updateCommand);

      console.log(`Updated credits to ${updatedCredits} for user ${email}`);
      return updatedCredits;
    }

    throw new Error("User sub not found");
  } catch (error) {
    console.error("Failed to add credits:", error);
    throw new Error("Failed to add credits");
  }
};
const mainFlow = async (
  customerEmail: string | null | undefined,
  payment_link: string | undefined
) => {
  if (!customerEmail) throw new Error("Stripe customer email not found");
  if (!payment_link) throw new Error("Stripe payment link undefined");

  let subscriptionVal = "FREE";

  // Determine the subscription level based on the payment link
  const proLinks = [
    "plink_1RGCBoDEtadHu4lcxIQkOnaz",
    "plink_1RGCDPDEtadHu4lcrL6ksMEg",
  ];
  const standardLinks = [
    "plink_1RGC7HDEtadHu4lctzA3LcXU",
    "plink_1RGCAXDEtadHu4lcLafGscz6",
  ];
  const creditOnlyLink = "plink_1RGLJiDEtadHu4lcE3uSsucR";

  if (proLinks.includes(payment_link)) {
    subscriptionVal = "PRO";
  } else if (standardLinks.includes(payment_link)) {
    subscriptionVal = "STANDARD";
  }

  // Update subscription attribute if applicable
  if (subscriptionVal !== "FREE") {
    await updateUserAttribute(customerEmail, "subscription", subscriptionVal);
  }

  // Add credits for the specific payment link
  if (payment_link === creditOnlyLink) {
    await addCreditsToUser(customerEmail, 50);
  }

  // Prepare and send confirmation email
  try {
    const fromEmailAddress = "subscription@app.rezlinks.com";
    const toAddresses = [customerEmail]; // add user's actual email here
    let subject = "Your Subscription Update!";
    let html = "";

    if (subscriptionVal !== "FREE") {
      subject = `${subscriptionVal} SUBSCRIPTION!`;
      html = `Congratulations ${customerEmail}! 🎉<br>Your subscription has been updated to <strong>${subscriptionVal}</strong>.`;
    } else if (payment_link === creditOnlyLink) {
      subject = "50 Credits Added!";
      html = `Hi ${customerEmail},<br><br>50 credits have been successfully added to your account! 🚀`;
    }

    console.log(
      "EMAIL SENDING...",
      fromEmailAddress,
      toAddresses,
      subject,
      html
    );

    // await sendHTMLEmail(fromEmailAddress, toAddresses, subject, html);

    return {
      email: customerEmail,
      status: "success",
      subscription: subscriptionVal,
      creditsAdded: payment_link === creditOnlyLink ? 50 : 0,
    };
  } catch (err) {
    console.error("MAINFLOW FAILED TO SEND EMAIL:", err);
    throw new Error("Failed to send confirmation email");
  }
};

export const handler = async (event: any) => {
  const stripeEvent = await verifyWebhookSig(event);
  switch (stripeEvent.type) {
    case "checkout.session.completed":
      let subscription = await mainFlow(
        stripeEvent.data.object.customer_details?.email,
        stripeEvent.data.object.payment_link?.toString()
      );
      return `Subscription Added ${subscription}`;
  }
};
