/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateAnalytics = /* GraphQL */ `subscription OnCreateAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onCreateAnalytics(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAnalyticsSubscriptionVariables,
  APITypes.OnCreateAnalyticsSubscription
>;
export const onCreateLink = /* GraphQL */ `subscription OnCreateLink($filter: ModelSubscriptionLinkFilterInput) {
  onCreateLink(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLinkSubscriptionVariables,
  APITypes.OnCreateLinkSubscription
>;
export const onCreateNotification = /* GraphQL */ `subscription OnCreateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onCreateNotification(filter: $filter) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateNotificationSubscriptionVariables,
  APITypes.OnCreateNotificationSubscription
>;
export const onCreateResume = /* GraphQL */ `subscription OnCreateResume($filter: ModelSubscriptionResumeFilterInput) {
  onCreateResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateResumeSubscriptionVariables,
  APITypes.OnCreateResumeSubscription
>;
export const onCreateSession = /* GraphQL */ `subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
  onCreateSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionSubscriptionVariables,
  APITypes.OnCreateSessionSubscription
>;
export const onDeleteAnalytics = /* GraphQL */ `subscription OnDeleteAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onDeleteAnalytics(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAnalyticsSubscriptionVariables,
  APITypes.OnDeleteAnalyticsSubscription
>;
export const onDeleteLink = /* GraphQL */ `subscription OnDeleteLink($filter: ModelSubscriptionLinkFilterInput) {
  onDeleteLink(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLinkSubscriptionVariables,
  APITypes.OnDeleteLinkSubscription
>;
export const onDeleteNotification = /* GraphQL */ `subscription OnDeleteNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onDeleteNotification(filter: $filter) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteNotificationSubscriptionVariables,
  APITypes.OnDeleteNotificationSubscription
>;
export const onDeleteResume = /* GraphQL */ `subscription OnDeleteResume($filter: ModelSubscriptionResumeFilterInput) {
  onDeleteResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteResumeSubscriptionVariables,
  APITypes.OnDeleteResumeSubscription
>;
export const onDeleteSession = /* GraphQL */ `subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
  onDeleteSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionSubscriptionVariables,
  APITypes.OnDeleteSessionSubscription
>;
export const onUpdateAnalytics = /* GraphQL */ `subscription OnUpdateAnalytics($filter: ModelSubscriptionAnalyticsFilterInput) {
  onUpdateAnalytics(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAnalyticsSubscriptionVariables,
  APITypes.OnUpdateAnalyticsSubscription
>;
export const onUpdateLink = /* GraphQL */ `subscription OnUpdateLink($filter: ModelSubscriptionLinkFilterInput) {
  onUpdateLink(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLinkSubscriptionVariables,
  APITypes.OnUpdateLinkSubscription
>;
export const onUpdateNotification = /* GraphQL */ `subscription OnUpdateNotification(
  $filter: ModelSubscriptionNotificationFilterInput
) {
  onUpdateNotification(filter: $filter) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateNotificationSubscriptionVariables,
  APITypes.OnUpdateNotificationSubscription
>;
export const onUpdateResume = /* GraphQL */ `subscription OnUpdateResume($filter: ModelSubscriptionResumeFilterInput) {
  onUpdateResume(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateResumeSubscriptionVariables,
  APITypes.OnUpdateResumeSubscription
>;
export const onUpdateSession = /* GraphQL */ `subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
  onUpdateSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionSubscriptionVariables,
  APITypes.OnUpdateSessionSubscription
>;
