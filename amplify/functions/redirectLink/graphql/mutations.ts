/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAnalytics = /* GraphQL */ `mutation CreateAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: CreateAnalyticsInput!
) {
  createAnalytics(condition: $condition, input: $input) {
    createdAt
    download
    heatmapId
    id
    percentageRead
    session {
      createdAt
      duration
      id
      linkId
      number
      openedTime
      updatedAt
      __typename
    }
    sessionId
    updatedAt
    viewTime
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAnalyticsMutationVariables,
  APITypes.CreateAnalyticsMutation
>;
export const createLink = /* GraphQL */ `mutation CreateLink(
  $condition: ModelLinkConditionInput
  $input: CreateLinkInput!
) {
  createLink(condition: $condition, input: $input) {
    active
    createdAt
    id
    resume {
      active
      createdAt
      id
      path
      title
      updatedAt
      userId
      __typename
    }
    resumeId
    sendmail
    sessions {
      nextToken
      __typename
    }
    title
    updatedAt
    url
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLinkMutationVariables,
  APITypes.CreateLinkMutation
>;
export const createNotification = /* GraphQL */ `mutation CreateNotification(
  $condition: ModelNotificationConditionInput
  $input: CreateNotificationInput!
) {
  createNotification(condition: $condition, input: $input) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNotificationMutationVariables,
  APITypes.CreateNotificationMutation
>;
export const createResume = /* GraphQL */ `mutation CreateResume(
  $condition: ModelResumeConditionInput
  $input: CreateResumeInput!
) {
  createResume(condition: $condition, input: $input) {
    active
    createdAt
    id
    links {
      nextToken
      __typename
    }
    path
    title
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateResumeMutationVariables,
  APITypes.CreateResumeMutation
>;
export const createSession = /* GraphQL */ `mutation CreateSession(
  $condition: ModelSessionConditionInput
  $input: CreateSessionInput!
) {
  createSession(condition: $condition, input: $input) {
    analytics {
      createdAt
      download
      heatmapId
      id
      percentageRead
      sessionId
      updatedAt
      viewTime
      __typename
    }
    createdAt
    duration
    id
    link {
      active
      createdAt
      id
      resumeId
      sendmail
      title
      updatedAt
      url
      userId
      __typename
    }
    linkId
    number
    openedTime
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSessionMutationVariables,
  APITypes.CreateSessionMutation
>;
export const deleteAnalytics = /* GraphQL */ `mutation DeleteAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: DeleteAnalyticsInput!
) {
  deleteAnalytics(condition: $condition, input: $input) {
    createdAt
    download
    heatmapId
    id
    percentageRead
    session {
      createdAt
      duration
      id
      linkId
      number
      openedTime
      updatedAt
      __typename
    }
    sessionId
    updatedAt
    viewTime
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAnalyticsMutationVariables,
  APITypes.DeleteAnalyticsMutation
>;
export const deleteLink = /* GraphQL */ `mutation DeleteLink(
  $condition: ModelLinkConditionInput
  $input: DeleteLinkInput!
) {
  deleteLink(condition: $condition, input: $input) {
    active
    createdAt
    id
    resume {
      active
      createdAt
      id
      path
      title
      updatedAt
      userId
      __typename
    }
    resumeId
    sendmail
    sessions {
      nextToken
      __typename
    }
    title
    updatedAt
    url
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLinkMutationVariables,
  APITypes.DeleteLinkMutation
>;
export const deleteNotification = /* GraphQL */ `mutation DeleteNotification(
  $condition: ModelNotificationConditionInput
  $input: DeleteNotificationInput!
) {
  deleteNotification(condition: $condition, input: $input) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNotificationMutationVariables,
  APITypes.DeleteNotificationMutation
>;
export const deleteResume = /* GraphQL */ `mutation DeleteResume(
  $condition: ModelResumeConditionInput
  $input: DeleteResumeInput!
) {
  deleteResume(condition: $condition, input: $input) {
    active
    createdAt
    id
    links {
      nextToken
      __typename
    }
    path
    title
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteResumeMutationVariables,
  APITypes.DeleteResumeMutation
>;
export const deleteSession = /* GraphQL */ `mutation DeleteSession(
  $condition: ModelSessionConditionInput
  $input: DeleteSessionInput!
) {
  deleteSession(condition: $condition, input: $input) {
    analytics {
      createdAt
      download
      heatmapId
      id
      percentageRead
      sessionId
      updatedAt
      viewTime
      __typename
    }
    createdAt
    duration
    id
    link {
      active
      createdAt
      id
      resumeId
      sendmail
      title
      updatedAt
      url
      userId
      __typename
    }
    linkId
    number
    openedTime
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSessionMutationVariables,
  APITypes.DeleteSessionMutation
>;
export const updateAnalytics = /* GraphQL */ `mutation UpdateAnalytics(
  $condition: ModelAnalyticsConditionInput
  $input: UpdateAnalyticsInput!
) {
  updateAnalytics(condition: $condition, input: $input) {
    createdAt
    download
    heatmapId
    id
    percentageRead
    session {
      createdAt
      duration
      id
      linkId
      number
      openedTime
      updatedAt
      __typename
    }
    sessionId
    updatedAt
    viewTime
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAnalyticsMutationVariables,
  APITypes.UpdateAnalyticsMutation
>;
export const updateLink = /* GraphQL */ `mutation UpdateLink(
  $condition: ModelLinkConditionInput
  $input: UpdateLinkInput!
) {
  updateLink(condition: $condition, input: $input) {
    active
    createdAt
    id
    resume {
      active
      createdAt
      id
      path
      title
      updatedAt
      userId
      __typename
    }
    resumeId
    sendmail
    sessions {
      nextToken
      __typename
    }
    title
    updatedAt
    url
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLinkMutationVariables,
  APITypes.UpdateLinkMutation
>;
export const updateNotification = /* GraphQL */ `mutation UpdateNotification(
  $condition: ModelNotificationConditionInput
  $input: UpdateNotificationInput!
) {
  updateNotification(condition: $condition, input: $input) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNotificationMutationVariables,
  APITypes.UpdateNotificationMutation
>;
export const updateResume = /* GraphQL */ `mutation UpdateResume(
  $condition: ModelResumeConditionInput
  $input: UpdateResumeInput!
) {
  updateResume(condition: $condition, input: $input) {
    active
    createdAt
    id
    links {
      nextToken
      __typename
    }
    path
    title
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateResumeMutationVariables,
  APITypes.UpdateResumeMutation
>;
export const updateSession = /* GraphQL */ `mutation UpdateSession(
  $condition: ModelSessionConditionInput
  $input: UpdateSessionInput!
) {
  updateSession(condition: $condition, input: $input) {
    analytics {
      createdAt
      download
      heatmapId
      id
      percentageRead
      sessionId
      updatedAt
      viewTime
      __typename
    }
    createdAt
    duration
    id
    link {
      active
      createdAt
      id
      resumeId
      sendmail
      title
      updatedAt
      url
      userId
      __typename
    }
    linkId
    number
    openedTime
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSessionMutationVariables,
  APITypes.UpdateSessionMutation
>;
