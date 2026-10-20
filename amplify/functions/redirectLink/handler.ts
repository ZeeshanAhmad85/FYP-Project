import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';
import { env } from '$amplify/env/redirectLink'; 
import { listLinkByUrl } from './graphql/queries';
import { getResume } from './graphql/queries';
import { createNotification } from './graphql/mutations';
import { sendViewEmail } from './graphql/queries';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
      region: env.AWS_REGION,
      defaultAuthMode: 'apiKey',
      apiKey: env.API_KEY,
    },
  },
});

const client = generateClient<Schema>();
const s3Client = new S3Client();

export const handler: Schema["redirectLink"]["functionHandler"] = async (event) => {
  const { linkurl } = event.arguments;

  console.log("REDIRECT FUNCTION URL:", linkurl);

  try {
    // Fetch link information by URL
    const { data: linkresult, errors } = await client.graphql({
      query: listLinkByUrl,
      variables: { url: linkurl },
    });

    if (errors) {
      console.log("ERROR GETTING LINK BY URL:", JSON.stringify(errors));
      throw new Error("Failed to fetch link by URL");
    }

    console.log("List link by URL result:", JSON.stringify(linkresult));

    const resumeId = linkresult.listLinkByUrl.items.at(0)?.resumeId;
    const linkId = linkresult.listLinkByUrl.items.at(0)?.id;
    const userid = linkresult.listLinkByUrl.items.at(0)?.userId;
    const linktitle = linkresult.listLinkByUrl.items.at(0)?.title;
    const sendmail = linkresult.listLinkByUrl.items.at(0)?.sendmail;

    let resumeurl;
    let resumePath;

    if (resumeId) {
      // Fetch resume details
      try {
        const { data: resumeresult, errors } = await client.graphql({
          query: getResume,
          variables: { id: resumeId },
        });

        if (errors) {
          console.log("ERROR FETCHING RESUME:", JSON.stringify(errors));
          throw new Error("Failed to fetch resume details");
        }

        console.log("Get resume result:", JSON.stringify(resumeresult));

        resumePath = resumeresult.getResume?.path;

        if (resumePath) {
          const command = new GetObjectCommand({
            Bucket: env.REZ_LINK_STORAGE_BUCKET_NAME,
            Key: resumePath,
          });
          resumeurl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          console.log("Presigned URL is:", resumeurl);
        }
      } catch (err) {
        console.log("ERROR GENERATING PRESIGNED URL:", JSON.stringify(err));
        throw new Error("Getting presigned URL failed");
      }
    }

    let returndata = {
      resume: "",
      linkid: "",
      path: "",
    };

    if (resumeurl && linkId && resumePath) {
      console.log("RETURN DATA UPDATED");
      returndata = {
        resume: resumeurl.toString(),
        linkid: linkId,
        path: resumePath,
      };

      const datetime = new Date().toISOString();

      if (userid) {
        // Create notification for link view
        try {
          const { data: notification, errors } = await client.graphql({
            query: createNotification,
            variables: {
              input: {
                userId: userid,
                message: `Bingo! Your Link "${linktitle}" just got a view.`,
                messageTime: datetime,
              },
            },
          });

          if (errors) {
            console.log("ERROR ADDING NOTIFICATION ON LINK VIEW:", JSON.stringify(errors));
          } else {
            console.log("Notification added for link view:", JSON.stringify(notification), sendmail);

            if (sendmail) {
              // Send email notification if sendmail is true
              try {
                const { data, errors } = await client.graphql({
                  query: sendViewEmail,
                  variables: { userId: userid, linktitle: linktitle || "" },
                });

                if (errors) {
                  console.log("ERROR SENDING EMAIL:", JSON.stringify(errors));
                } else {
                  console.log("EMAIL SENT:", JSON.stringify(data));
                }
              } catch (emailError) {
                console.log("ERROR IN EMAIL PROCESS:", JSON.stringify(emailError));
              }
            }
          }
        } catch (notificationError) {
          console.log("ERROR IN NOTIFICATION PROCESS:", JSON.stringify(notificationError));
        }
      }
    }

    return returndata;
  } catch (error) {
    console.log("GENERAL ERROR IN HANDLER:", JSON.stringify(error));
    throw new Error("Handler execution failed");
  }
};
