import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource"; // Path to your backend resource definition
import output from "../../amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { getResumeCount } from "../functions/getResumeCount";
import { getLinkCount } from "../functions/getLinkCount";
import { getAvgViewTime } from "../functions/getAvgViewTime";
import { getActiveLinkCount } from "../functions/getActiveLinkCount";

Amplify.configure(output);
const client = generateClient<Schema>({
  authMode: "apiKey",
});

export const createResume = async ({
  title,
  userId,
  path,
  active = true,
}: {
  title: string;
  userId: string;
  path: string;
  active?: boolean;
}) => {
  try {
    const { data: resume, errors } = await client.models.Resume.create({
      title,
      userId,
      path,
      active,
      isBuilt: false, // This is an uploaded resume, not built with the builder
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

//   For Building Resume

// Function to create a resume using the resume builder
export const createBuiltResume = async ({
  title,
  userId,
  templateType,
  data,
  active = true,
}: {
  title: string;
  userId: string;
  templateType: string;
  data: any;
  active?: boolean;
}) => {
  try {
    console.log("DATA", userId, title);
    const { data: resume, errors } = await client.models.Resume.create({
      title,
      userId,
      path: "", // Path will be populated later when PDF is generated
      active,
      isBuilt: true, // This is a resume built with the builder
      templateType,
      data: JSON.stringify(data), // Store the complete resume data structure
    });

    console.log("RESUME", resume);

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

// Function to update an existing built resume
export const updateBuiltResume = async ({
  id,
  title,
  data,
  active,
}: {
  id: string;
  title?: string;
  data?: any;
  active?: boolean;
}) => {
  try {
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (data !== undefined) updateData.data = JSON.stringify(data);
    if (active !== undefined) updateData.active = active;

    const { data: resume, errors } = await client.models.Resume.update({
      id,
      ...updateData,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

export const deleteResume = async (id: string) => {
  try {
    const { data: resume, errors } = await client.models.Resume.delete({ id });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

export const fetchResumes = async () => {
  try {
    const { data: resume, errors } = await client.models.Resume.list();

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

export const fetchFeedbackByResumeId = async (resumeId: string) => {
  try {
    const { data: feedback, errors } =
      await client.models.Feedback.listFeedbackByResumeId(
        {
          resumeId: resumeId,
        },
        {
          selectionSet: ["id", "resumeId", "rating", "text", "createdAt"],
        }
      );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return feedback;
  } catch (error) {
    throw error;
  }
};

export const fetchResumesByUserId = async (userId: string) => {
  try {
    const { data: resumes, errors } =
      await client.models.Resume.listResumeByUserId(
        {
          userId: userId,
        },
        {
          selectionSet: [
            "active",
            "createdAt",
            "id",
            "links.active",
            "links.createdAt",
            "path",
            "title",
            "isBuilt",
            "templateType",
            "data",
            "updatedAt",
            "userId",
            "links.url",
            "links.id",
            "links.updatedAt",
            "links.sendmail",
            "links.title",
            "links.sessions.*",
            "links.sessions.analytics.*",
          ],
        }
      );

    console.log(resumes);

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resumes;
  } catch (error) {
    throw error;
  }
};

export const getResumeById = async (id: string) => {
  try {
    const { data: resume, errors } = await client.models.Resume.get({ id });
    console.log(resume, "CHECK");

    if (errors) {
      throw new Error(errors[0].message);
    }

    if (resume && resume.data) {
      if (typeof resume?.data === "string") {
        resume.data = JSON.parse(resume.data);
      } else {
        resume.data = null;
      }
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

export const getSessionsById = async (linkId: string) => {
  try {
    const { data: sessions, errors } =
      await client.models.Session.listSessionByLinkId(
        {
          linkId: linkId,
        },
        {
          selectionSet: [
            "id",
            "linkId",
            "number",
            "openedTime",
            "duration",
            "analytics.*",
          ],
        }
      );

    if (errors) {
      throw new Error(errors[0].message);
    }
    return sessions;
  } catch (error) {
    throw error;
  }
};

export const createSession = async ({
  linkId,
  number,
  openedTime,
}: {
  linkId: string;
  number: number;
  openedTime: any;
}) => {
  try {
    const { data: session, errors } = await client.models.Session.create({
      linkId,
      number,
      openedTime,
      duration: 0,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const generateUniqueLink = async () => {
  try {
    const { data: link, errors } = await client.queries.generateLink();
    if (errors) {
      throw new Error(errors[0].message);
    }

    return link;
  } catch (error) {
    throw error;
  }
};

export const updateSession = async ({
  id,
  duration,
}: {
  id: string;
  duration: any;
}) => {
  try {
    const { data: session, errors } = await client.models.Session.update({
      id,
      duration,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }
    return session;
  } catch (error) {
    throw error;
  }
};

export const getAnalyticsBySessionId = async ({
  session_Id,
}: {
  session_Id: any;
}) => {
  try {
    const { data: analytics, errors } =
      await client.models.Analytics.listAnalyticsBySessionId({
        sessionId: session_Id,
      });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return analytics;
  } catch (error) {
    throw error;
  }
};

export const createAnalytics = async ({
  sessionId,
  viewTime,
  download,
  percentageRead,
  heatmapId,
}: {
  sessionId: string;
  viewTime: any;
  download: any;
  percentageRead: number;
  heatmapId: any;
}) => {
  try {
    const { data: analytics, errors } = await client.models.Analytics.create({
      sessionId,
      viewTime,
      download,
      percentageRead,
      heatmapId,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return analytics;
  } catch (error) {
    throw error;
  }
};

export const updateAnalytics = async ({
  id,
  sessionId,
  viewTime,
  download,
  percentageRead,
  heatmapId,
}: {
  id: any;
  sessionId: string;
  viewTime: any;
  download: any;
  percentageRead: number;
  heatmapId: any;
}) => {
  try {
    const { data: analytics, errors } = await client.models.Analytics.update({
      id,
      sessionId,
      viewTime,
      download,
      percentageRead,
      heatmapId,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return analytics;
  } catch (error) {
    throw error;
  }
};

//   CREATE LINK
export const createLink = async ({
  resumeId,
  userId,
  title,
  url,
  emailNotification = false,
}: {
  resumeId: string;
  userId: string;
  title: string;
  url: string;
  emailNotification?: boolean;
}) => {
  try {
    const { data: link, errors } = await client.models.Link.create({
      resumeId,
      userId,
      title,
      url,
      sendmail: emailNotification,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    const datetime = new Date().toISOString();

    try {
      const { data: notification, errors } =
        await client.models.Notification.create({
          userId: userId,
          message: `Whoo! Your Link \"${title}\"is live and ready to be shared.`,
          messageTime: datetime,
        });

      if (errors) {
        console.log(errors, "ERROR ADDING NOTIFCATION ON LINK CREATION!");
      }
    } catch (error) {
      throw error;
    }

    return link;
  } catch (error) {
    throw error;
  }
};

//   UPDATE RESUME BY ID
export const updateResume = async ({
  id,
  title,
  path,
  active,
  userId,
}: {
  id: string;
  title: string;
  path: string;
  active: boolean;
  userId: string;
}) => {
  try {
    const { data: resume, errors } = await client.models.Resume.update({
      id,
      title,
      path,
      active,
      userId,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return resume;
  } catch (error) {
    throw error;
  }
};

//  FETCH RESUME COUNT

export const fetchResumeCount = async (userId: string) => {
  try {
    const data = await getResumeCount(userId);

    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchLinkCount = async (userId: string) => {
  try {
    const data = await getLinkCount(userId);

    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAverageViewTime = async (userId: string) => {
  try {
    const data = await getAvgViewTime(userId);

    return data;
  } catch (error) {
    throw error;
  }
};

export const getLinkById = async (id: string) => {
  try {
    const { data: link, errors } = await client.models.Link.get(
      { id },
      {
        selectionSet: [
          "userId",
          "title",
          "resumeId",
          "url",
          "active",
          "sessions.*",
          "sessions.analytics.*",
        ],
      }
    );
    if (errors) {
      throw new Error(errors[0].message);
    }

    return link;
  } catch (error) {
    throw error;
  }
};

export const getLinkTitleById = async (id: string) => {
  try {
    const { data: link, errors } = await client.models.Link.get(
      { id },
      {
        selectionSet: [
          "userId",
          "title",
          // "url",
          // "active",
          // "sessions.*",
          // "sessions.analytics.*",
        ],
      }
    );
    if (errors) {
      throw new Error(errors[0].message);
    }

    return link;
  } catch (error) {
    throw error;
  }
};

//  LIST LINKS BY RESUME ID
export const fetchLinksByUserId = async (userId: string) => {
  try {
    const { data: links, errors } = await client.models.Link.listLinkByUserId(
      {
        userId,
      },
      {
        selectionSet: [
          "active",
          "createdAt",
          "id",
          "resumeId",
          "sendmail",
          "title",
          "updatedAt",
          "userId",
          "url",
          "sessions.analytics.*",
          "sessions.duration",
          "sessions.number",
          "resume.title",
          "resume.links.sessions.analytics.*",
          "resume.links.sessions.number",
        ],
      }
    );

    if (errors) {
      throw new Error(errors[0].message);
    }

    return links;
  } catch (error) {
    throw error;
  }
};
//  Update Link

export const updateLink = async ({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) => {
  try {
    const { data: link, errors } = await client.models.Link.update({
      id,
      active,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }
    return link;
  } catch (error) {
    throw error;
  }
};

//  fetching Stats

export const fetchActiveLinksCount = async (userId: string) => {
  try {
    const data = await getActiveLinkCount(userId);

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteLink = async (id: string) => {
  try {
    const { data: link, errors } = await client.models.Link.delete({
      id,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }
    return link;
  } catch (error) {
    throw error;
  }
};

export const emailChecker = async (email: any) => {
  try {
    const { data: emailCheck, errors } = await client.queries.verifyEmail({
      email: email,
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return emailCheck;
  } catch (error) {
    throw error;
  }
};
