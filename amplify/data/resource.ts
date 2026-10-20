import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { generateLink } from "../functions/generateLink/resource";
import { sendViewEmail } from "../functions/sendViewEmail/resource";
import { redirectLink } from "../functions/redirectLink/resource";
import { verifyEmail } from "../functions/verifyEmail/resource";

const schema = a
  .schema({
    Resume: a
      .model({
        userId: a.string().required(),
        title: a.string().required(),
        path: a.string().required(),
        //  For resume builder templates
        isBuilt: a.boolean().default(false), // NEW: Flag to check if the resume is built (true) or uploaded (false)
        templateType: a.string(), // Optional: Template used for built resumes (e.g., "template-1",)
        data: a.json(), // Optional: Structured data for built resumes
        active: a.boolean().default(true),
        links: a.hasMany("Link", "resumeId"),
        feedback: a.hasMany("Feedback", "resumeId"),
      })
      .secondaryIndexes((index) => [index("userId")]),

    Link: a
      .model({
        resumeId: a.id().required(),
        resume: a.belongsTo("Resume", "resumeId"),
        userId: a.string().required(),
        title: a.string().required(),
        url: a.string().required(),
        sendmail: a.boolean().default(false),
        active: a.boolean().default(true),
        sessions: a.hasMany("Session", "linkId"),
      })
      .secondaryIndexes((index) => [
        index("url"),
        index("userId"),
        index("resumeId"),
      ]),

    Session: a
      .model({
        linkId: a.id().required(),
        link: a.belongsTo("Link", "linkId"),
        number: a.integer().required(),
        openedTime: a.datetime().required(),
        duration: a.integer(),
        analytics: a.hasOne("Analytics", "sessionId"),
      })
      .secondaryIndexes((index) => [index("linkId")]),

    Analytics: a
      .model({
        sessionId: a.id().required(),
        session: a.belongsTo("Session", "sessionId"),
        viewTime: a.json(),
        download: a.datetime().array(),
        percentageRead: a.float(),
        heatmapId: a.string().array(),
      })
      .secondaryIndexes((index) => [index("sessionId")]),

    Notification: a
      .model({
        userId: a.string().required(),
        message: a.string().required(),
        messageTime: a.datetime().required(),
        isRead: a.boolean().default(false),
      })
      .secondaryIndexes((index) => [index("userId")]),

    Feedback: a
      .model({
        resumeId: a.id().required(),
        resume: a.belongsTo("Resume", "resumeId"),
        rating: a.integer(),
        text: a.string(),
      })
      .secondaryIndexes((index) => [index("resumeId")]),

    generateLink: a
      .query()
      .returns(a.string())
      .handler(a.handler.function(generateLink)),

    sendViewEmail: a
      .query()
      .arguments({
        userId: a.string().required(),
        linktitle: a.string().required(),
      })
      .returns(a.string())
      .handler(a.handler.function(sendViewEmail)),

    redirectLink: a
      .query()
      .arguments({
        linkurl: a.string().required(),
      })
      .returns(
        a.customType({
          resume: a.string(),
          linkid: a.string(),
          path: a.string(),
        })
      )
      .handler(a.handler.function(redirectLink)),

    verifyEmail: a
      .query()
      .arguments({
        email: a.string(),
      })
      .returns(a.boolean())
      .handler(a.handler.function(verifyEmail)),
  })
  .authorization((allow) => [
    allow.publicApiKey(),
    allow.resource(redirectLink),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
