/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Analytics = {
  __typename: "Analytics",
  createdAt: string,
  download?: Array< string | null > | null,
  heatmapId?: Array< string | null > | null,
  id: string,
  percentageRead?: number | null,
  session?: Session | null,
  sessionId: string,
  updatedAt: string,
  viewTime?: string | null,
};

export type Session = {
  __typename: "Session",
  analytics?: Analytics | null,
  createdAt: string,
  duration?: number | null,
  id: string,
  link?: Link | null,
  linkId: string,
  number: number,
  openedTime: string,
  updatedAt: string,
};

export type Link = {
  __typename: "Link",
  active?: boolean | null,
  createdAt: string,
  id: string,
  resume?: Resume | null,
  resumeId: string,
  sendmail?: boolean | null,
  sessions?: ModelSessionConnection | null,
  title: string,
  updatedAt: string,
  url: string,
  userId: string,
};

export type Resume = {
  __typename: "Resume",
  active?: boolean | null,
  createdAt: string,
  id: string,
  links?: ModelLinkConnection | null,
  path: string,
  title: string,
  updatedAt: string,
  userId: string,
};

export type ModelLinkConnection = {
  __typename: "ModelLinkConnection",
  items:  Array<Link | null >,
  nextToken?: string | null,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items:  Array<Session | null >,
  nextToken?: string | null,
};

export type Notification = {
  __typename: "Notification",
  createdAt: string,
  id: string,
  message: string,
  messageTime: string,
  updatedAt: string,
  userId: string,
};

export type ModelAnalyticsFilterInput = {
  and?: Array< ModelAnalyticsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  download?: ModelStringInput | null,
  heatmapId?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelAnalyticsFilterInput | null,
  or?: Array< ModelAnalyticsFilterInput | null > | null,
  percentageRead?: ModelFloatInput | null,
  sessionId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  viewTime?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelAnalyticsConnection = {
  __typename: "ModelAnalyticsConnection",
  items:  Array<Analytics | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelLinkFilterInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelLinkFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelLinkFilterInput | null,
  or?: Array< ModelLinkFilterInput | null > | null,
  resumeId?: ModelIDInput | null,
  sendmail?: ModelBooleanInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  url?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelNotificationFilterInput = {
  and?: Array< ModelNotificationFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  message?: ModelStringInput | null,
  messageTime?: ModelStringInput | null,
  not?: ModelNotificationFilterInput | null,
  or?: Array< ModelNotificationFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelNotificationConnection = {
  __typename: "ModelNotificationConnection",
  items:  Array<Notification | null >,
  nextToken?: string | null,
};

export type ModelResumeFilterInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelResumeFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelResumeFilterInput | null,
  or?: Array< ModelResumeFilterInput | null > | null,
  path?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type ModelResumeConnection = {
  __typename: "ModelResumeConnection",
  items:  Array<Resume | null >,
  nextToken?: string | null,
};

export type ModelSessionFilterInput = {
  and?: Array< ModelSessionFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  id?: ModelIDInput | null,
  linkId?: ModelIDInput | null,
  not?: ModelSessionFilterInput | null,
  number?: ModelIntInput | null,
  openedTime?: ModelStringInput | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type RedirectLinkReturnType = {
  __typename: "RedirectLinkReturnType",
  linkid?: string | null,
  path?: string | null,
  resume?: string | null,
};

export type ModelAnalyticsConditionInput = {
  and?: Array< ModelAnalyticsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  download?: ModelStringInput | null,
  heatmapId?: ModelStringInput | null,
  not?: ModelAnalyticsConditionInput | null,
  or?: Array< ModelAnalyticsConditionInput | null > | null,
  percentageRead?: ModelFloatInput | null,
  sessionId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  viewTime?: ModelStringInput | null,
};

export type CreateAnalyticsInput = {
  download?: Array< string | null > | null,
  heatmapId?: Array< string | null > | null,
  id?: string | null,
  percentageRead?: number | null,
  sessionId: string,
  viewTime?: string | null,
};

export type ModelLinkConditionInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelLinkConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelLinkConditionInput | null,
  or?: Array< ModelLinkConditionInput | null > | null,
  resumeId?: ModelIDInput | null,
  sendmail?: ModelBooleanInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  url?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateLinkInput = {
  active?: boolean | null,
  id?: string | null,
  resumeId: string,
  sendmail?: boolean | null,
  title: string,
  url: string,
  userId: string,
};

export type ModelNotificationConditionInput = {
  and?: Array< ModelNotificationConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  message?: ModelStringInput | null,
  messageTime?: ModelStringInput | null,
  not?: ModelNotificationConditionInput | null,
  or?: Array< ModelNotificationConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateNotificationInput = {
  id?: string | null,
  message: string,
  messageTime: string,
  userId: string,
};

export type ModelResumeConditionInput = {
  active?: ModelBooleanInput | null,
  and?: Array< ModelResumeConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelResumeConditionInput | null,
  or?: Array< ModelResumeConditionInput | null > | null,
  path?: ModelStringInput | null,
  title?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  userId?: ModelStringInput | null,
};

export type CreateResumeInput = {
  active?: boolean | null,
  id?: string | null,
  path: string,
  title: string,
  userId: string,
};

export type ModelSessionConditionInput = {
  and?: Array< ModelSessionConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  duration?: ModelIntInput | null,
  linkId?: ModelIDInput | null,
  not?: ModelSessionConditionInput | null,
  number?: ModelIntInput | null,
  openedTime?: ModelStringInput | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSessionInput = {
  duration?: number | null,
  id?: string | null,
  linkId: string,
  number: number,
  openedTime: string,
};

export type DeleteAnalyticsInput = {
  id: string,
};

export type DeleteLinkInput = {
  id: string,
};

export type DeleteNotificationInput = {
  id: string,
};

export type DeleteResumeInput = {
  id: string,
};

export type DeleteSessionInput = {
  id: string,
};

export type UpdateAnalyticsInput = {
  download?: Array< string | null > | null,
  heatmapId?: Array< string | null > | null,
  id: string,
  percentageRead?: number | null,
  sessionId?: string | null,
  viewTime?: string | null,
};

export type UpdateLinkInput = {
  active?: boolean | null,
  id: string,
  resumeId?: string | null,
  sendmail?: boolean | null,
  title?: string | null,
  url?: string | null,
  userId?: string | null,
};

export type UpdateNotificationInput = {
  id: string,
  message?: string | null,
  messageTime?: string | null,
  userId?: string | null,
};

export type UpdateResumeInput = {
  active?: boolean | null,
  id: string,
  path?: string | null,
  title?: string | null,
  userId?: string | null,
};

export type UpdateSessionInput = {
  duration?: number | null,
  id: string,
  linkId?: string | null,
  number?: number | null,
  openedTime?: string | null,
};

export type ModelSubscriptionAnalyticsFilterInput = {
  and?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  download?: ModelSubscriptionStringInput | null,
  heatmapId?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  percentageRead?: ModelSubscriptionFloatInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  viewTime?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionLinkFilterInput = {
  active?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionLinkFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionLinkFilterInput | null > | null,
  resumeId?: ModelSubscriptionIDInput | null,
  sendmail?: ModelSubscriptionBooleanInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  url?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionNotificationFilterInput = {
  and?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  message?: ModelSubscriptionStringInput | null,
  messageTime?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionNotificationFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionResumeFilterInput = {
  active?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionResumeFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionResumeFilterInput | null > | null,
  path?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionSessionFilterInput = {
  and?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  duration?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  linkId?: ModelSubscriptionIDInput | null,
  number?: ModelSubscriptionIntInput | null,
  openedTime?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type GenerateLinkQueryVariables = {
};

export type GenerateLinkQuery = {
  generateLink?: string | null,
};

export type GetAnalyticsQueryVariables = {
  id: string,
};

export type GetAnalyticsQuery = {
  getAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type GetLinkQueryVariables = {
  id: string,
};

export type GetLinkQuery = {
  getLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type GetNotificationQueryVariables = {
  id: string,
};

export type GetNotificationQuery = {
  getNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetResumeQueryVariables = {
  id: string,
};

export type GetResumeQuery = {
  getResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type GetSessionQueryVariables = {
  id: string,
};

export type GetSessionQuery = {
  getSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type ListAnalyticsQueryVariables = {
  filter?: ModelAnalyticsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnalyticsQuery = {
  listAnalytics?:  {
    __typename: "ModelAnalyticsConnection",
    items:  Array< {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListAnalyticsBySessionIdQueryVariables = {
  filter?: ModelAnalyticsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListAnalyticsBySessionIdQuery = {
  listAnalyticsBySessionId?:  {
    __typename: "ModelAnalyticsConnection",
    items:  Array< {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLinkByResumeIdQueryVariables = {
  filter?: ModelLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  resumeId: string,
  sortDirection?: ModelSortDirection | null,
};

export type ListLinkByResumeIdQuery = {
  listLinkByResumeId?:  {
    __typename: "ModelLinkConnection",
    items:  Array< {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLinkByUrlQueryVariables = {
  filter?: ModelLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  url: string,
};

export type ListLinkByUrlQuery = {
  listLinkByUrl?:  {
    __typename: "ModelLinkConnection",
    items:  Array< {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLinkByUserIdQueryVariables = {
  filter?: ModelLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListLinkByUserIdQuery = {
  listLinkByUserId?:  {
    __typename: "ModelLinkConnection",
    items:  Array< {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLinksQueryVariables = {
  filter?: ModelLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLinksQuery = {
  listLinks?:  {
    __typename: "ModelLinkConnection",
    items:  Array< {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNotificationByUserIdQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListNotificationByUserIdQuery = {
  listNotificationByUserId?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      createdAt: string,
      id: string,
      message: string,
      messageTime: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListNotificationsQueryVariables = {
  filter?: ModelNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNotificationsQuery = {
  listNotifications?:  {
    __typename: "ModelNotificationConnection",
    items:  Array< {
      __typename: "Notification",
      createdAt: string,
      id: string,
      message: string,
      messageTime: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListResumeByUserIdQueryVariables = {
  filter?: ModelResumeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  userId: string,
};

export type ListResumeByUserIdQuery = {
  listResumeByUserId?:  {
    __typename: "ModelResumeConnection",
    items:  Array< {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListResumesQueryVariables = {
  filter?: ModelResumeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListResumesQuery = {
  listResumes?:  {
    __typename: "ModelResumeConnection",
    items:  Array< {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSessionByLinkIdQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  linkId: string,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListSessionByLinkIdQuery = {
  listSessionByLinkId?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSessionsQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type RedirectLinkQueryVariables = {
  linkurl: string,
};

export type RedirectLinkQuery = {
  redirectLink?:  {
    __typename: "RedirectLinkReturnType",
    linkid?: string | null,
    path?: string | null,
    resume?: string | null,
  } | null,
};

export type SendViewEmailQueryVariables = {
  linktitle: string,
  userId: string,
};

export type SendViewEmailQuery = {
  sendViewEmail?: string | null,
};

export type CreateAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: CreateAnalyticsInput,
};

export type CreateAnalyticsMutation = {
  createAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type CreateLinkMutationVariables = {
  condition?: ModelLinkConditionInput | null,
  input: CreateLinkInput,
};

export type CreateLinkMutation = {
  createLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type CreateNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: CreateNotificationInput,
};

export type CreateNotificationMutation = {
  createNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreateResumeMutationVariables = {
  condition?: ModelResumeConditionInput | null,
  input: CreateResumeInput,
};

export type CreateResumeMutation = {
  createResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type CreateSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: CreateSessionInput,
};

export type CreateSessionMutation = {
  createSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type DeleteAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: DeleteAnalyticsInput,
};

export type DeleteAnalyticsMutation = {
  deleteAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type DeleteLinkMutationVariables = {
  condition?: ModelLinkConditionInput | null,
  input: DeleteLinkInput,
};

export type DeleteLinkMutation = {
  deleteLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type DeleteNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: DeleteNotificationInput,
};

export type DeleteNotificationMutation = {
  deleteNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteResumeMutationVariables = {
  condition?: ModelResumeConditionInput | null,
  input: DeleteResumeInput,
};

export type DeleteResumeMutation = {
  deleteResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type DeleteSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: DeleteSessionInput,
};

export type DeleteSessionMutation = {
  deleteSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type UpdateAnalyticsMutationVariables = {
  condition?: ModelAnalyticsConditionInput | null,
  input: UpdateAnalyticsInput,
};

export type UpdateAnalyticsMutation = {
  updateAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type UpdateLinkMutationVariables = {
  condition?: ModelLinkConditionInput | null,
  input: UpdateLinkInput,
};

export type UpdateLinkMutation = {
  updateLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type UpdateNotificationMutationVariables = {
  condition?: ModelNotificationConditionInput | null,
  input: UpdateNotificationInput,
};

export type UpdateNotificationMutation = {
  updateNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateResumeMutationVariables = {
  condition?: ModelResumeConditionInput | null,
  input: UpdateResumeInput,
};

export type UpdateResumeMutation = {
  updateResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type UpdateSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: UpdateSessionInput,
};

export type UpdateSessionMutation = {
  updateSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnCreateAnalyticsSubscription = {
  onCreateAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type OnCreateLinkSubscriptionVariables = {
  filter?: ModelSubscriptionLinkFilterInput | null,
};

export type OnCreateLinkSubscription = {
  onCreateLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type OnCreateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnCreateNotificationSubscription = {
  onCreateNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateResumeSubscriptionVariables = {
  filter?: ModelSubscriptionResumeFilterInput | null,
};

export type OnCreateResumeSubscription = {
  onCreateResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnCreateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnCreateSessionSubscription = {
  onCreateSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnDeleteAnalyticsSubscription = {
  onDeleteAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type OnDeleteLinkSubscriptionVariables = {
  filter?: ModelSubscriptionLinkFilterInput | null,
};

export type OnDeleteLinkSubscription = {
  onDeleteLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type OnDeleteNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnDeleteNotificationSubscription = {
  onDeleteNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteResumeSubscriptionVariables = {
  filter?: ModelSubscriptionResumeFilterInput | null,
};

export type OnDeleteResumeSubscription = {
  onDeleteResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnDeleteSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnDeleteSessionSubscription = {
  onDeleteSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
};

export type OnUpdateAnalyticsSubscription = {
  onUpdateAnalytics?:  {
    __typename: "Analytics",
    createdAt: string,
    download?: Array< string | null > | null,
    heatmapId?: Array< string | null > | null,
    id: string,
    percentageRead?: number | null,
    session?:  {
      __typename: "Session",
      createdAt: string,
      duration?: number | null,
      id: string,
      linkId: string,
      number: number,
      openedTime: string,
      updatedAt: string,
    } | null,
    sessionId: string,
    updatedAt: string,
    viewTime?: string | null,
  } | null,
};

export type OnUpdateLinkSubscriptionVariables = {
  filter?: ModelSubscriptionLinkFilterInput | null,
};

export type OnUpdateLinkSubscription = {
  onUpdateLink?:  {
    __typename: "Link",
    active?: boolean | null,
    createdAt: string,
    id: string,
    resume?:  {
      __typename: "Resume",
      active?: boolean | null,
      createdAt: string,
      id: string,
      path: string,
      title: string,
      updatedAt: string,
      userId: string,
    } | null,
    resumeId: string,
    sendmail?: boolean | null,
    sessions?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    title: string,
    updatedAt: string,
    url: string,
    userId: string,
  } | null,
};

export type OnUpdateNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionNotificationFilterInput | null,
};

export type OnUpdateNotificationSubscription = {
  onUpdateNotification?:  {
    __typename: "Notification",
    createdAt: string,
    id: string,
    message: string,
    messageTime: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateResumeSubscriptionVariables = {
  filter?: ModelSubscriptionResumeFilterInput | null,
};

export type OnUpdateResumeSubscription = {
  onUpdateResume?:  {
    __typename: "Resume",
    active?: boolean | null,
    createdAt: string,
    id: string,
    links?:  {
      __typename: "ModelLinkConnection",
      nextToken?: string | null,
    } | null,
    path: string,
    title: string,
    updatedAt: string,
    userId: string,
  } | null,
};

export type OnUpdateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnUpdateSessionSubscription = {
  onUpdateSession?:  {
    __typename: "Session",
    analytics?:  {
      __typename: "Analytics",
      createdAt: string,
      download?: Array< string | null > | null,
      heatmapId?: Array< string | null > | null,
      id: string,
      percentageRead?: number | null,
      sessionId: string,
      updatedAt: string,
      viewTime?: string | null,
    } | null,
    createdAt: string,
    duration?: number | null,
    id: string,
    link?:  {
      __typename: "Link",
      active?: boolean | null,
      createdAt: string,
      id: string,
      resumeId: string,
      sendmail?: boolean | null,
      title: string,
      updatedAt: string,
      url: string,
      userId: string,
    } | null,
    linkId: string,
    number: number,
    openedTime: string,
    updatedAt: string,
  } | null,
};
