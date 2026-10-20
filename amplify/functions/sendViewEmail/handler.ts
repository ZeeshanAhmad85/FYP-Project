import type { Schema } from "../../data/resource";
import { sendHTMLEmail } from "./sendHTMLEmail";
import { env } from '$amplify/env/sendViewEmail';
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const userPoolId = env.AMPLIFY_AUTH_USERPOOL_ID;
const client = new CognitoIdentityProviderClient();

export const handler: Schema["sendViewEmail"]["functionHandler"] = async (event, context) => {
  const { userId, linktitle } = event.arguments

  const command = new AdminGetUserCommand({
    UserPoolId: userPoolId,
    Username: userId
  });
  
  try {
    const response = await client.send(command);
    
    const userAttributes = response.UserAttributes;
    const emailAttribute = userAttributes?.find(attr => attr.Name === 'email');
    const email = emailAttribute ? emailAttribute.Value : "";

    const nameAttribute = userAttributes?.find(attr => attr.Name === 'given_name');
    const username = nameAttribute ? nameAttribute.Value : "";

    if(email){
      const fromEmailAddress = "linkview@app.rezlinks.com";
      const toAddresses = [""]; //add email
      const subject = "LINK GOT A VIEW!";
      const html = `Congratulation ${username}!! Your link ${linktitle} got a view :).`;

      console.log("EMAIL SENDING...",fromEmailAddress, toAddresses, subject, html);

  
      //await sendHTMLEmail(fromEmailAddress, toAddresses, subject, html);
    }


    return "sent";


    
  } catch (error) {
    console.error(error);
  }

  const status = "failed"

  return status;
};