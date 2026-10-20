import type { Schema } from "../../data/resource";
import { env } from '$amplify/env/verifyEmail';
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const userPoolId = env.AMPLIFY_AUTH_USERPOOL_ID;
const client = new CognitoIdentityProviderClient();

export const handler: Schema["verifyEmail"]["functionHandler"] = async (event, context) => {
    const { email } = event.arguments

    const command = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter : `email = \"${email}\"`
      });
      
      try {
        const response = await client.send(command);
        console.log("Users List: ", response);
        if(response.Users?.length === 0){
            return false;
        }
        return true;
      }
      catch(err){
        console.log("Error while fetching all users", err);
      }

    return false;
}