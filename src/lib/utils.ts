import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from "date-fns";

import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export const getResumeId = async (linkurl: string) => {
  var { data, errors } = await client.models.Link.listLinkByUrl({
    url: linkurl,
  });

  if (errors) {
    console.log(errors, "ERROR GETRESUMEID BYLINKURL");
  }

  const resumeId = data.at(0)?.resumeId;
  const linkId = data.at(0)?.id;
  const userId = data.at(0)?.userId;
  const linktitle = data.at(0)?.title;
  const sendmail = data.at(0)?.sendmail;

  const returndata = {
    resumeid: resumeId,
    linkid: linkId,
    userid: userId,
    linktitle: linktitle,
    sendmail: sendmail,
  };

  return returndata;
};
export const redirectLink = async (linkurl: string) => {
  const data = await getResumeId(linkurl);

  const resumeId = data?.resumeid;
  const linkId = data?.linkid;
  const userid = data?.userid;
  const linktitle = data?.linktitle;
  const sendmail = data?.sendmail;

  var resumeurl;
  var resumePath;

  if (resumeId) {
    const { data, errors } = await client.models.Resume.get({
      id: resumeId,
    });

    if (errors) {
      console.log(errors, "ERROR FETCHING RESUME REDIRECTION");
    }

    resumePath = data?.path;

    if (resumePath) {
      resumeurl = await getUrl({
        path: resumePath,
        options: {
          validateObjectExistence: false,
          expiresIn: 3600,
          useAccelerateEndpoint: false,
        },
      });
    }
  }

  var returndata = {
    resume: "",
    linkid: "",
    path: "",
  };

  if (resumeurl && linkId && resumePath) {
    returndata = {
      resume: resumeurl.url.href,
      linkid: linkId,
      path: resumePath,
    };

    const datetime = new Date().toISOString();

    try {
      if (userid) {
        const { data: notification, errors } =
          await client.models.Notification.create({
            userId: userid,
            message: `Bingo! Your Link \"${linktitle}\"just got a view.`,
            messageTime: datetime,
          });

        if (errors) {
          console.log(errors, "ERROR ADDING NOTIFCATION ON LINK VIEW!");
        } else {
          console.log(
            notification,
            "Notification added for link View",
            sendmail
          );

          if (sendmail) {
            const { data, errors } = await client.queries.sendViewEmail({
              userId: userid,
              linktitle: linktitle ? linktitle : "",
            });

            if (errors) {
              console.log(errors, "ERROR SENDING EMAIL");
            }
          }
        }

        return returndata;
      }
    } catch (error) {
      throw error;
    }
  }

  return returndata;
};

export const redirectResumePath = async (linkurl: string) => {
  const data = await getResumeId(linkurl);

  const resumeId = data?.resumeid;
  const linkId = data?.linkid;
  const userid = data?.userid;
  const linktitle = data?.linktitle;
  const sendmail = data?.sendmail;

  var resumeurl;
  var resumePath;

  if (resumeId) {
    const { data, errors } = await client.models.Resume.get({
      id: resumeId,
    });

    if (errors) {
      console.log(errors, "ERROR FETCHING RESUME REDIRECTION");
    }

    resumePath = data?.path;

    if (resumePath) {
      resumeurl = await getUrl({
        path: resumePath,
        options: {
          validateObjectExistence: false,
          expiresIn: 3600,
          useAccelerateEndpoint: false,
        },
      });

      console.log("url extracted: ", resumeurl);
    }
  }

  var returndata = {
    resume: "",
    linkid: "",
    path: "",
  };

  if (resumeurl && linkId && resumePath) {
    returndata = {
      resume: resumeurl.url.href,
      linkid: linkId,
      path: resumePath,
    };
  }

  var resumeurl;
  var resumePath;

  if (resumeId) {
    const { data, errors } = await client.models.Resume.get({
      id: resumeId,
    });

    if (errors) {
      console.log(errors, "ERROR FETCHING RESUME REDIRECTION");
    }

    resumePath = data?.path;
    return resumePath;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const validatePassword = (value: string) => {
  const minLength = 8;
  const hasNumber = /[0-9]/.test(value);
  const specialChar = new RegExp("(?=.*[!@#$%^&*\\-/,\\\\])");
  const hasSpecialChar = specialChar.test(value);
  return value?.length >= minLength && hasNumber && hasSpecialChar;
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const formatDate = (timestamp: any) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    // If the timestamp is invalid, return it as is
    return timestamp;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })?.format(date);
};

export const formatTime12Hour = (timestamp: any) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};
export const formatTime = (time: number) => {
  if (!time) return "0ms";

  if (time < 1000) {
    return `${time}ms`;
  } else if (time < 60000) {
    const seconds = (time / 1000).toFixed(2);
    return `${seconds}s`;
  } else if (time < 3600000) {
    const minutes = Math.floor(time / 60000).toString();
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}min ${seconds}s`;
  } else {
    const hours = Math.floor(time / 3600000).toString();
    const minutes = Math.floor((time % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${hours}h ${minutes}min ${seconds}s`;
  }
};

export const createJsonFile = (data: any) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  return { url, blob };
};

export function constructMetadata({
  //  Rezlink Title
  title = "Rezlinks - A resume sharing platform",
  description = "Rezlinks is a resume sharing platform that allows you to share your resume with others.",
  image = "/logo-new.svg",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },

    icons,
    metadataBase: new URL("https://master.dyxjc0hf9ffu6.amplifyapp.com"),
  };
}

export function handleError(error: any) {
  // Log the original error for debugging purposes

  // Extract the error message or use a default message
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  // Throw a new Error with the extracted or default message
  throw new Error(errorMessage);
}

export function convertDateToResumeModified(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function removePrefix(str: any, prefix: any) {
  if (str?.startsWith(prefix)) {
    return str.slice(prefix.length);
  }
  return str;
}

export function formatViews(views: number) {
  return views < 10 ? `0${views}` : views;
}

export function millisecondsToSeconds(milliseconds: number, fixed = 0) {
  return (milliseconds / 1000).toFixed(fixed);
}

export const formatDateMonths = (timestamp: any) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const formatTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const minutesAgo = differenceInMinutes(now, createdDate);
  const hoursAgo = differenceInHours(now, createdDate);
  const daysAgo = differenceInDays(now, createdDate);
  const weeksAgo = differenceInWeeks(now, createdDate);

  if (weeksAgo > 0) {
    return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""} ago`;
  }
  if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  }
  if (hoursAgo > 0) {
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }
  return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
};

export const shortenLink = (link: string, maxLength: number) => {
  if (link.length <= maxLength) {
    return link;
  }
  return `${link.substring(0, maxLength)}...`;
};
export function getPastWeekStartDate() {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  return today;
}

export function getPastMonthStartDate() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  return today;
}

export function getPastThreeMonthsStartDate() {
  const today = new Date();
  today.setMonth(today.getMonth() - 3);
  return today;
}
