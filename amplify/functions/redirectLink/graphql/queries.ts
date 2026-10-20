/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const generateLink = /* GraphQL */ `query GenerateLink {
  generateLink
}
` as GeneratedQuery<
  APITypes.GenerateLinkQueryVariables,
  APITypes.GenerateLinkQuery
>;
export const getAnalytics = /* GraphQL */ `query GetAnalytics($id: ID!) {
  getAnalytics(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAnalyticsQueryVariables,
  APITypes.GetAnalyticsQuery
>;
export const getLink = /* GraphQL */ `query GetLink($id: ID!) {
  getLink(id: $id) {
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
` as GeneratedQuery<APITypes.GetLinkQueryVariables, APITypes.GetLinkQuery>;
export const getNotification = /* GraphQL */ `query GetNotification($id: ID!) {
  getNotification(id: $id) {
    createdAt
    id
    message
    messageTime
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNotificationQueryVariables,
  APITypes.GetNotificationQuery
>;
export const getResume = /* GraphQL */ `query GetResume($id: ID!) {
  getResume(id: $id) {
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
` as GeneratedQuery<APITypes.GetResumeQueryVariables, APITypes.GetResumeQuery>;
export const getSession = /* GraphQL */ `query GetSession($id: ID!) {
  getSession(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSessionQueryVariables,
  APITypes.GetSessionQuery
>;
export const listAnalytics = /* GraphQL */ `query ListAnalytics(
  $filter: ModelAnalyticsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalyticsQueryVariables,
  APITypes.ListAnalyticsQuery
>;
export const listAnalyticsBySessionId = /* GraphQL */ `query ListAnalyticsBySessionId(
  $filter: ModelAnalyticsFilterInput
  $limit: Int
  $nextToken: String
  $sessionId: ID!
  $sortDirection: ModelSortDirection
) {
  listAnalyticsBySessionId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sessionId: $sessionId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalyticsBySessionIdQueryVariables,
  APITypes.ListAnalyticsBySessionIdQuery
>;
export const listLinkByResumeId = /* GraphQL */ `query ListLinkByResumeId(
  $filter: ModelLinkFilterInput
  $limit: Int
  $nextToken: String
  $resumeId: ID!
  $sortDirection: ModelSortDirection
) {
  listLinkByResumeId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    resumeId: $resumeId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLinkByResumeIdQueryVariables,
  APITypes.ListLinkByResumeIdQuery
>;
export const listLinkByUrl = /* GraphQL */ `query ListLinkByUrl(
  $filter: ModelLinkFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $url: String!
) {
  listLinkByUrl(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    url: $url
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLinkByUrlQueryVariables,
  APITypes.ListLinkByUrlQuery
>;
export const listLinkByUserId = /* GraphQL */ `query ListLinkByUserId(
  $filter: ModelLinkFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userId: String!
) {
  listLinkByUserId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userId: $userId
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLinkByUserIdQueryVariables,
  APITypes.ListLinkByUserIdQuery
>;
export const listLinks = /* GraphQL */ `query ListLinks(
  $filter: ModelLinkFilterInput
  $limit: Int
  $nextToken: String
) {
  listLinks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListLinksQueryVariables, APITypes.ListLinksQuery>;
export const listNotificationByUserId = /* GraphQL */ `query ListNotificationByUserId(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userId: String!
) {
  listNotificationByUserId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userId: $userId
  ) {
    items {
      createdAt
      id
      message
      messageTime
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationByUserIdQueryVariables,
  APITypes.ListNotificationByUserIdQuery
>;
export const listNotifications = /* GraphQL */ `query ListNotifications(
  $filter: ModelNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      message
      messageTime
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListNotificationsQueryVariables,
  APITypes.ListNotificationsQuery
>;
export const listResumeByUserId = /* GraphQL */ `query ListResumeByUserId(
  $filter: ModelResumeFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userId: String!
) {
  listResumeByUserId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userId: $userId
  ) {
    items {
      active
      createdAt
      id
      path
      title
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListResumeByUserIdQueryVariables,
  APITypes.ListResumeByUserIdQuery
>;
export const listResumes = /* GraphQL */ `query ListResumes(
  $filter: ModelResumeFilterInput
  $limit: Int
  $nextToken: String
) {
  listResumes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      active
      createdAt
      id
      path
      title
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListResumesQueryVariables,
  APITypes.ListResumesQuery
>;
export const listSessionByLinkId = /* GraphQL */ `query ListSessionByLinkId(
  $filter: ModelSessionFilterInput
  $limit: Int
  $linkId: ID!
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listSessionByLinkId(
    filter: $filter
    limit: $limit
    linkId: $linkId
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      duration
      id
      linkId
      number
      openedTime
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSessionByLinkIdQueryVariables,
  APITypes.ListSessionByLinkIdQuery
>;
export const listSessions = /* GraphQL */ `query ListSessions(
  $filter: ModelSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      duration
      id
      linkId
      number
      openedTime
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSessionsQueryVariables,
  APITypes.ListSessionsQuery
>;
export const redirectLink = /* GraphQL */ `query RedirectLink($linkurl: String!) {
  redirectLink(linkurl: $linkurl) {
    linkid
    path
    resume
    __typename
  }
}
` as GeneratedQuery<
  APITypes.RedirectLinkQueryVariables,
  APITypes.RedirectLinkQuery
>;
export const sendViewEmail = /* GraphQL */ `query SendViewEmail($linktitle: String!, $userId: String!) {
  sendViewEmail(linktitle: $linktitle, userId: $userId)
}
` as GeneratedQuery<
  APITypes.SendViewEmailQueryVariables,
  APITypes.SendViewEmailQuery
>;
