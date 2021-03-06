import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: any;
  UUID: any;
};

export type AddBoardInput = {
  isPrivate: Scalars['Boolean'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type AddCommentInput = {
  content: Scalars['String'];
  entryId: Scalars['UUID'];
  isPrivate?: Maybe<Scalars['Boolean']>;
  replyToCommentId?: Maybe<Scalars['UUID']>;
};

export type AddEntryInput = {
  assigneeUserId?: Maybe<Scalars['UUID']>;
  boardId: Scalars['UUID'];
  content?: Maybe<Scalars['String']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  statusId?: Maybe<Scalars['UUID']>;
  title: Scalars['String'];
};

export type AddInviteInput = {
  email: Scalars['String'];
  role: UserRole;
};

export type AddStatusInput = {
  color: Scalars['String'];
  name: Scalars['String'];
  sortIndex?: Maybe<Scalars['Int']>;
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER'
}

export type BeginPasswordlessLoginInput = {
  email: Scalars['String'];
};

export type Board = {
  __typename?: 'Board';
  color: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  isListed: Scalars['Boolean'];
  isPrivate: Scalars['Boolean'];
  isSeoIndexed: Scalars['Boolean'];
  name: Scalars['String'];
  projectId: Scalars['UUID'];
  slug: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  entryId: Scalars['UUID'];
  id: Scalars['UUID'];
  isPrivate: Scalars['Boolean'];
  likedByMe: Scalars['Boolean'];
  replyTo?: Maybe<Comment>;
  replyToId?: Maybe<Scalars['UUID']>;
  replyToRootId?: Maybe<Scalars['UUID']>;
  stats: CommentStats;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CommentStats = {
  __typename?: 'CommentStats';
  likes: Scalars['Int'];
  replies: Scalars['Int'];
};

/** A connection to a list of items. */
export type CommentsConnection = {
  __typename?: 'CommentsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CommentsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Comment>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CommentsEdge = {
  __typename?: 'CommentsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Comment;
};

export type CompletePasswordlessLoginInput = {
  code: Scalars['String'];
  token: Scalars['String'];
};

export type Config = {
  __typename?: 'Config';
  basePath: Scalars['String'];
  emptyGuid: Scalars['UUID'];
};

/** A connection to a list of items. */
export type EntriesConnection = {
  __typename?: 'EntriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<EntriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Entry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type EntriesEdge = {
  __typename?: 'EntriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Entry;
};

export type EntriesInput = {
  boardIds?: Maybe<Array<Scalars['UUID']>>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  query?: Maybe<Scalars['String']>;
  statusIds?: Maybe<Array<Scalars['UUID']>>;
  userIds?: Maybe<Array<Scalars['UUID']>>;
  voterUserIds?: Maybe<Array<Scalars['UUID']>>;
};

export type EntriesOrderByInput = {
  createdAt?: Maybe<OrderBy>;
  votes?: Maybe<OrderBy>;
  watchers?: Maybe<OrderBy>;
};

export type Entry = {
  __typename?: 'Entry';
  assignedUser?: Maybe<User>;
  assignedUserId?: Maybe<Scalars['UUID']>;
  board: Board;
  boardId: Scalars['UUID'];
  comments?: Maybe<CommentsConnection>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  isArchived: Scalars['Boolean'];
  isDeleted: Scalars['Boolean'];
  isLocked: Scalars['Boolean'];
  isPrivate: Scalars['Boolean'];
  pathname: Scalars['String'];
  slug: Scalars['String'];
  stats: EntryStats;
  status: Status;
  statusId: Scalars['UUID'];
  subscribedByMe: Scalars['Boolean'];
  subscribers?: Maybe<SubscribersConnection>;
  title: Scalars['String'];
  upvotedByMe: Scalars['Boolean'];
  upvoters?: Maybe<UpvotersConnection>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['UUID']>;
};


export type EntryCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  includeReplies?: Scalars['Boolean'];
  last?: Maybe<Scalars['Int']>;
};


export type EntrySubscribersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type EntryUpvotersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type EntryStats = {
  __typename?: 'EntryStats';
  comments: Scalars['Int'];
  subscriptions: Scalars['Int'];
  votes: Scalars['Int'];
};

export type Image = {
  __typename?: 'Image';
  format: Scalars['String'];
  height: Scalars['Int'];
  id: Scalars['UUID'];
  url: Scalars['String'];
  width: Scalars['Int'];
};


export type ImageUrlArgs = {
  width?: Scalars['Int'];
};

export type Invite = {
  __typename?: 'Invite';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['UUID'];
  token?: Maybe<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  remember?: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addBoard: Board;
  addComment: Comment;
  addEntry: Entry;
  addInvite: Invite;
  addStatus: Status;
  beginPasswordlessLogin: Scalars['String'];
  completePasswordlessLogin: User;
  login: OperationResult;
  logout: OperationResult;
  register: User;
  removeBoard: OperationResult;
  removeComment: OperationResult;
  removeEntry: OperationResult;
  removeInvite: OperationResult;
  removeStatus: OperationResult;
  removeUser: OperationResult;
  saveBoard: Board;
  saveComment: Comment;
  saveEntry: Entry;
  savePassword: OperationResult;
  saveProject: Project;
  saveSsoConfig: SsoConfig;
  saveStatus: Status;
  saveUser: User;
  subscribeEntry: Entry;
  unSubscribeEntry: Entry;
  voteComment: Comment;
  voteEntry: Entry;
};


export type MutationAddBoardArgs = {
  input: AddBoardInput;
};


export type MutationAddCommentArgs = {
  input: AddCommentInput;
};


export type MutationAddEntryArgs = {
  input: AddEntryInput;
};


export type MutationAddInviteArgs = {
  input: AddInviteInput;
};


export type MutationAddStatusArgs = {
  input: AddStatusInput;
};


export type MutationBeginPasswordlessLoginArgs = {
  input: BeginPasswordlessLoginInput;
};


export type MutationCompletePasswordlessLoginArgs = {
  input: CompletePasswordlessLoginInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRemoveBoardArgs = {
  input: RemoveBoardInput;
};


export type MutationRemoveCommentArgs = {
  input: RemoveCommentInput;
};


export type MutationRemoveEntryArgs = {
  input: RemoveEntryInput;
};


export type MutationRemoveInviteArgs = {
  input: RemoveInviteInput;
};


export type MutationRemoveStatusArgs = {
  input: RemoveStatusInput;
};


export type MutationRemoveUserArgs = {
  input: RemoveUserInput;
};


export type MutationSaveBoardArgs = {
  input: SaveBoardInput;
};


export type MutationSaveCommentArgs = {
  input: SaveCommentInput;
};


export type MutationSaveEntryArgs = {
  input: SaveEntryInput;
};


export type MutationSavePasswordArgs = {
  input: SavePasswordInput;
};


export type MutationSaveProjectArgs = {
  input: SaveProjectInput;
};


export type MutationSaveSsoConfigArgs = {
  input: SaveSsoConfigInput;
};


export type MutationSaveStatusArgs = {
  input: SaveStatusInput;
};


export type MutationSaveUserArgs = {
  input: SaveUserInput;
};


export type MutationSubscribeEntryArgs = {
  input: SubscribeEntryInput;
};


export type MutationUnSubscribeEntryArgs = {
  input: UnSubscribeEntryInput;
};


export type MutationVoteCommentArgs = {
  input: VoteCommentInput;
};


export type MutationVoteEntryArgs = {
  input: VoteEntryInput;
};

export enum OperationResult {
  Fail = 'FAIL',
  Success = 'SUCCESS'
}

export enum OrderBy {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  authMethod: ProjectAuthMethod;
  createdAt: Scalars['DateTime'];
  faviconImage?: Maybe<Image>;
  faviconURL: Scalars['String'];
  id: Scalars['UUID'];
  logoImage?: Maybe<Image>;
  logoURL: Scalars['String'];
  name: Scalars['String'];
  ssoConfig: SsoConfig;
  website?: Maybe<Scalars['String']>;
};

export enum ProjectAuthMethod {
  Mail = 'MAIL',
  None = 'NONE',
  Password = 'PASSWORD',
  Redirect = 'REDIRECT'
}

export type Query = {
  __typename?: 'Query';
  board?: Maybe<Board>;
  boards: Array<Board>;
  config: Config;
  echo: Scalars['String'];
  entries?: Maybe<EntriesConnection>;
  entry?: Maybe<Entry>;
  image?: Maybe<Image>;
  invites: Array<Invite>;
  lookupEntry?: Maybe<Entry>;
  lookupInvite?: Maybe<Invite>;
  me?: Maybe<User>;
  members: Array<User>;
  project?: Maybe<Project>;
  statuses: Array<Status>;
  user?: Maybe<User>;
  users?: Maybe<UsersConnection>;
};


export type QueryBoardArgs = {
  id?: Maybe<Scalars['UUID']>;
  slug?: Maybe<Scalars['String']>;
};


export type QueryEchoArgs = {
  input: Scalars['String'];
};


export type QueryEntriesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  input?: Maybe<EntriesInput>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EntriesOrderByInput>;
};


export type QueryEntryArgs = {
  id: Scalars['UUID'];
};


export type QueryImageArgs = {
  id: Scalars['UUID'];
};


export type QueryLookupEntryArgs = {
  boardSlug: Scalars['String'];
  entrySlug: Scalars['String'];
};


export type QueryLookupInviteArgs = {
  token: Scalars['String'];
};


export type QueryMembersArgs = {
  input?: Maybe<UsersInput>;
  orderBy?: Maybe<UsersOrderByInput>;
};


export type QueryUserArgs = {
  id: Scalars['UUID'];
};


export type QueryUsersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  input?: Maybe<UsersInput>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UsersOrderByInput>;
};

export type RegisterInput = {
  displayName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  inviteToken?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type RemoveBoardInput = {
  boardId: Scalars['UUID'];
};

export type RemoveCommentInput = {
  commentId: Scalars['UUID'];
};

export type RemoveEntryInput = {
  entryId: Scalars['UUID'];
};

export type RemoveInviteInput = {
  inviteId: Scalars['UUID'];
};

export type RemoveStatusInput = {
  statusId: Scalars['UUID'];
};

export type RemoveUserInput = {
  userId: Scalars['UUID'];
};

export type SaveBoardInput = {
  boardId: Scalars['UUID'];
  color?: Maybe<Scalars['String']>;
  isListed?: Maybe<Scalars['Boolean']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  isSeoIndexed?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type SaveCommentInput = {
  commentId: Scalars['UUID'];
  content?: Maybe<Scalars['String']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
};

export type SaveEntryInput = {
  assignedUserId?: Maybe<Scalars['UUID']>;
  boardId?: Maybe<Scalars['UUID']>;
  content?: Maybe<Scalars['String']>;
  entryId: Scalars['UUID'];
  isArchived?: Maybe<Scalars['Boolean']>;
  isLocked?: Maybe<Scalars['Boolean']>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  statusId?: Maybe<Scalars['UUID']>;
  title?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
};

export type SavePasswordInput = {
  currentPassword?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

export type SaveProjectInput = {
  faviconImageId?: Maybe<Scalars['UUID']>;
  logoImageId?: Maybe<Scalars['UUID']>;
  name?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type SaveSsoConfigInput = {
  loginUrl?: Maybe<Scalars['String']>;
  logoutUrl?: Maybe<Scalars['String']>;
};

export type SaveStatusInput = {
  color?: Maybe<Scalars['String']>;
  isDefault?: Maybe<Scalars['Boolean']>;
  isInRoadmap?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  sortIndex?: Maybe<Scalars['Int']>;
  statusId: Scalars['UUID'];
};

export type SaveUserInput = {
  displayName: Scalars['String'];
  email: Scalars['String'];
};

export type SsoConfig = {
  __typename?: 'SsoConfig';
  id: Scalars['UUID'];
  loginUrl?: Maybe<Scalars['String']>;
  logoutUrl?: Maybe<Scalars['String']>;
  ssoKey?: Maybe<Scalars['String']>;
};

export type Status = {
  __typename?: 'Status';
  color: Scalars['String'];
  id: Scalars['UUID'];
  isDefault: Scalars['Boolean'];
  isInRoadmap: Scalars['Boolean'];
  name: Scalars['String'];
  projectId: Scalars['UUID'];
  sortIndex: Scalars['Int'];
};

export type SubscribeEntryInput = {
  entryId: Scalars['UUID'];
};

/** A connection to a list of items. */
export type SubscribersConnection = {
  __typename?: 'SubscribersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SubscribersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type SubscribersEdge = {
  __typename?: 'SubscribersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

export type UnSubscribeEntryInput = {
  entryId: Scalars['UUID'];
};

/** A connection to a list of items. */
export type UpvotersConnection = {
  __typename?: 'UpvotersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<UpvotersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type UpvotersEdge = {
  __typename?: 'UpvotersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String'];
  createdAt: Scalars['DateTime'];
  displayName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  hasPassword: Scalars['Boolean'];
  id: Scalars['UUID'];
  project: Project;
  projectId: Scalars['UUID'];
  role: UserRole;
  seenAt: Scalars['DateTime'];
  stats: UserStats;
};

export enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  User = 'USER',
  Visitor = 'VISITOR'
}

export type UserStats = {
  __typename?: 'UserStats';
  comments: Scalars['Int'];
  entries: Scalars['Int'];
  votes: Scalars['Int'];
};

/** A connection to a list of items. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<UsersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

export type UsersInput = {
  hasComment?: Maybe<Scalars['Boolean']>;
  hasEntry?: Maybe<Scalars['Boolean']>;
  query?: Maybe<Scalars['String']>;
};

export type UsersOrderByInput = {
  entries?: Maybe<OrderBy>;
  seenAt?: Maybe<OrderBy>;
  votes?: Maybe<OrderBy>;
};

export type VoteCommentInput = {
  commentId: Scalars['UUID'];
  delta?: Maybe<VoteDelta>;
};

export enum VoteDelta {
  Down = 'DOWN',
  Up = 'UP'
}

export type VoteEntryInput = {
  delta?: Maybe<VoteDelta>;
  entryId: Scalars['UUID'];
};

export type BoardSummaryFragment = { __typename?: 'Board', id: any, name: string, slug: string, color: string };

export type BoardFragment = { __typename?: 'Board', isPrivate: boolean, isListed: boolean, isSeoIndexed: boolean, id: any, name: string, slug: string, color: string };

export type BoardQueryVariables = Exact<{
  boardId?: Maybe<Scalars['UUID']>;
  boardSlug?: Maybe<Scalars['String']>;
}>;


export type BoardQuery = { __typename?: 'Query', board?: { __typename?: 'Board', isPrivate: boolean, isListed: boolean, isSeoIndexed: boolean, id: any, name: string, slug: string, color: string } | null | undefined };

export type BoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type BoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', isPrivate: boolean, isListed: boolean, isSeoIndexed: boolean, id: any, name: string, slug: string, color: string }> };

export type AddBoardMutationVariables = Exact<{
  input: AddBoardInput;
}>;


export type AddBoardMutation = { __typename?: 'Mutation', addBoard: { __typename?: 'Board', isPrivate: boolean, isListed: boolean, isSeoIndexed: boolean, id: any, name: string, slug: string, color: string } };

export type SaveBoardMutationVariables = Exact<{
  input: SaveBoardInput;
}>;


export type SaveBoardMutation = { __typename?: 'Mutation', saveBoard: { __typename?: 'Board', isPrivate: boolean, isListed: boolean, isSeoIndexed: boolean, id: any, name: string, slug: string, color: string } };

export type RemoveBoardMutationVariables = Exact<{
  input: RemoveBoardInput;
}>;


export type RemoveBoardMutation = { __typename?: 'Mutation', removeBoard: OperationResult };

export type CommentFragment = { __typename?: 'Comment', id: any, content: string, createdAt: any, likedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, stats: { __typename?: 'CommentStats', likes: number, replies: number } };

export type EntryCommentsQueryVariables = Exact<{
  entryId: Scalars['UUID'];
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
}>;


export type EntryCommentsQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', id: any, comments?: { __typename?: 'CommentsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'Comment', id: any, content: string, createdAt: any, likedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, stats: { __typename?: 'CommentStats', likes: number, replies: number } }> | null | undefined } | null | undefined } | null | undefined };

export type AddCommentMutationVariables = Exact<{
  input: AddCommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'Comment', id: any, content: string, createdAt: any, likedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, stats: { __typename?: 'CommentStats', likes: number, replies: number } } };

export type RemoveCommentMutationVariables = Exact<{
  input: RemoveCommentInput;
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', removeComment: OperationResult };

export type VoteCommentMutationVariables = Exact<{
  input: VoteCommentInput;
}>;


export type VoteCommentMutation = { __typename?: 'Mutation', voteComment: { __typename?: 'Comment', id: any, content: string, createdAt: any, likedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, stats: { __typename?: 'CommentStats', likes: number, replies: number } } };

export type SaveCommentMutationVariables = Exact<{
  input: SaveCommentInput;
}>;


export type SaveCommentMutation = { __typename?: 'Mutation', saveComment: { __typename?: 'Comment', id: any, content: string, createdAt: any, likedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, stats: { __typename?: 'CommentStats', likes: number, replies: number } } };

export type EntryFragment = { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } };

export type EntryQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type EntryQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } } | null | undefined };

export type LookupEntryQueryVariables = Exact<{
  boardSlug: Scalars['String'];
  entrySlug: Scalars['String'];
}>;


export type LookupEntryQuery = { __typename?: 'Query', lookupEntry?: { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } } | null | undefined };

export type EntriesConnectionFragment = { __typename?: 'EntriesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } }> | null | undefined };

export type EntriesQueryVariables = Exact<{
  input?: Maybe<EntriesInput>;
  orderBy?: Maybe<EntriesOrderByInput>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
}>;


export type EntriesQuery = { __typename?: 'Query', entries?: { __typename?: 'EntriesConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } }> | null | undefined } | null | undefined };

export type EntryUpvotersQueryVariables = Exact<{
  entryId: Scalars['UUID'];
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
}>;


export type EntryUpvotersQuery = { __typename?: 'Query', entry?: { __typename?: 'Entry', id: any, upvoters?: { __typename?: 'UpvotersConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } }> | null | undefined } | null | undefined } | null | undefined };

export type AddEntryMutationVariables = Exact<{
  input: AddEntryInput;
}>;


export type AddEntryMutation = { __typename?: 'Mutation', addEntry: { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } } };

export type SaveEntryMutationVariables = Exact<{
  input: SaveEntryInput;
}>;


export type SaveEntryMutation = { __typename?: 'Mutation', saveEntry: { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } } };

export type RemoveEntryMutationVariables = Exact<{
  input: RemoveEntryInput;
}>;


export type RemoveEntryMutation = { __typename?: 'Mutation', removeEntry: OperationResult };

export type VoteEntryMutationVariables = Exact<{
  input: VoteEntryInput;
}>;


export type VoteEntryMutation = { __typename?: 'Mutation', voteEntry: { __typename?: 'Entry', id: any, title: string, content?: string | null | undefined, slug: string, createdAt: any, isPrivate: boolean, isArchived: boolean, isDeleted: boolean, isLocked: boolean, pathname: string, upvotedByMe: boolean, user?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, assignedUser?: { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string } | null | undefined, board: { __typename?: 'Board', id: any, name: string, slug: string, color: string }, status: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }, stats: { __typename?: 'EntryStats', votes: number, comments: number, subscriptions: number } } };

export type PageInfoFragment = { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined };

export type ConfigFragment = { __typename?: 'Config', basePath: string, emptyGuid: any };

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'Query', config: { __typename?: 'Config', basePath: string, emptyGuid: any } };

export type ProjectFragment = { __typename?: 'Project', id: any, name: string, website?: string | null | undefined, logoURL: string, faviconURL: string };

export type ProjectQueryVariables = Exact<{
  includeDetails?: Scalars['Boolean'];
}>;


export type ProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: any, name: string, website?: string | null | undefined, logoURL: string, faviconURL: string, ssoConfig?: { __typename?: 'SsoConfig', id: any, loginUrl?: string | null | undefined, logoutUrl?: string | null | undefined, ssoKey?: string | null | undefined } | null | undefined } | null | undefined };

export type SaveProjectMutationVariables = Exact<{
  input: SaveProjectInput;
}>;


export type SaveProjectMutation = { __typename?: 'Mutation', saveProject: { __typename?: 'Project', id: any, name: string, website?: string | null | undefined, logoURL: string, faviconURL: string } };

export type InviteFragment = { __typename?: 'Invite', id: any, email: string, createdAt: any };

export type LookupInviteQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type LookupInviteQuery = { __typename?: 'Query', lookupInvite?: { __typename?: 'Invite', id: any, email: string, createdAt: any } | null | undefined };

export type ProjectMembersAndInvitesQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectMembersAndInvitesQuery = { __typename?: 'Query', members: Array<{ __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } }>, invites: Array<{ __typename?: 'Invite', token?: string | null | undefined, id: any, email: string, createdAt: any }> };

export type RemoveUserMutationVariables = Exact<{
  input: RemoveUserInput;
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: OperationResult };

export type AddInviteMutationVariables = Exact<{
  input: AddInviteInput;
}>;


export type AddInviteMutation = { __typename?: 'Mutation', addInvite: { __typename?: 'Invite', id: any } };

export type RemoveInviteMutationVariables = Exact<{
  input: RemoveInviteInput;
}>;


export type RemoveInviteMutation = { __typename?: 'Mutation', removeInvite: OperationResult };

export type SsoConfigFragment = { __typename?: 'SsoConfig', id: any, loginUrl?: string | null | undefined, logoutUrl?: string | null | undefined, ssoKey?: string | null | undefined };

export type SaveSsoConfigMutationVariables = Exact<{
  input: SaveSsoConfigInput;
}>;


export type SaveSsoConfigMutation = { __typename?: 'Mutation', saveSsoConfig: { __typename?: 'SsoConfig', id: any, loginUrl?: string | null | undefined, logoutUrl?: string | null | undefined, ssoKey?: string | null | undefined } };

export type StatusSummaryFragment = { __typename?: 'Status', id: any, name: string, color: string };

export type StatusFragment = { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string };

export type StatusesQueryVariables = Exact<{ [key: string]: never; }>;


export type StatusesQuery = { __typename?: 'Query', statuses: Array<{ __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string }> };

export type AddStatusMutationVariables = Exact<{
  input: AddStatusInput;
}>;


export type AddStatusMutation = { __typename?: 'Mutation', addStatus: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string } };

export type SaveStatusMutationVariables = Exact<{
  input: SaveStatusInput;
}>;


export type SaveStatusMutation = { __typename?: 'Mutation', saveStatus: { __typename?: 'Status', sortIndex: number, isDefault: boolean, isInRoadmap: boolean, id: any, name: string, color: string } };

export type RemoveStatusMutationVariables = Exact<{
  input: RemoveStatusInput;
}>;


export type RemoveStatusMutation = { __typename?: 'Mutation', removeStatus: OperationResult };

export type UserSummaryFragment = { __typename?: 'User', id: any, displayName?: string | null | undefined, avatar: string };

export type UserFragment = { __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } };

export type MeFragment = { __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } } | null | undefined };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: OperationResult };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: OperationResult };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'User', id: any } };

export type SaveMemberMutationVariables = Exact<{
  input: SaveUserInput;
}>;


export type SaveMemberMutation = { __typename?: 'Mutation', saveUser: { __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } } };

export type SavePasswordMutationVariables = Exact<{
  input: SavePasswordInput;
}>;


export type SavePasswordMutation = { __typename?: 'Mutation', savePassword: OperationResult };

export type UserQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } } | null | undefined };

export type UsersConnectionFragment = { __typename?: 'UsersConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } }> | null | undefined };

export type UsersQueryVariables = Exact<{
  orderBy?: Maybe<UsersOrderByInput>;
  input?: Maybe<UsersInput>;
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
}>;


export type UsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined }, nodes?: Array<{ __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } }> | null | undefined } | null | undefined };

export type MembersQueryVariables = Exact<{ [key: string]: never; }>;


export type MembersQuery = { __typename?: 'Query', members: Array<{ __typename?: 'User', email: string, createdAt: any, seenAt: any, role: UserRole, id: any, displayName?: string | null | undefined, avatar: string, stats: { __typename?: 'UserStats', votes: number, comments: number } }> };

export const BoardSummaryFragmentDoc = gql`
    fragment boardSummary on Board {
  id
  name
  slug
  color
}
    `;
export const BoardFragmentDoc = gql`
    fragment board on Board {
  ...boardSummary
  isPrivate
  isListed
  isSeoIndexed
}
    ${BoardSummaryFragmentDoc}`;
export const UserSummaryFragmentDoc = gql`
    fragment userSummary on User {
  id
  displayName
  avatar
}
    `;
export const CommentFragmentDoc = gql`
    fragment comment on Comment {
  id
  content
  createdAt
  user {
    ...userSummary
  }
  stats {
    likes
    replies
  }
  likedByMe
}
    ${UserSummaryFragmentDoc}`;
export const PageInfoFragmentDoc = gql`
    fragment pageInfo on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}
    `;
export const StatusSummaryFragmentDoc = gql`
    fragment statusSummary on Status {
  id
  name
  color
}
    `;
export const StatusFragmentDoc = gql`
    fragment status on Status {
  ...statusSummary
  sortIndex
  isDefault
  isInRoadmap
}
    ${StatusSummaryFragmentDoc}`;
export const EntryFragmentDoc = gql`
    fragment entry on Entry {
  id
  title
  content
  slug
  createdAt
  isPrivate
  isArchived
  isDeleted
  isLocked
  pathname
  upvotedByMe
  user {
    ...userSummary
  }
  assignedUser {
    ...userSummary
  }
  board {
    ...boardSummary
  }
  status {
    ...status
  }
  stats {
    votes
    comments
    subscriptions
  }
}
    ${UserSummaryFragmentDoc}
${BoardSummaryFragmentDoc}
${StatusFragmentDoc}`;
export const EntriesConnectionFragmentDoc = gql`
    fragment entriesConnection on EntriesConnection {
  totalCount
  pageInfo {
    ...pageInfo
  }
  nodes {
    ...entry
  }
}
    ${PageInfoFragmentDoc}
${EntryFragmentDoc}`;
export const ConfigFragmentDoc = gql`
    fragment config on Config {
  basePath
  emptyGuid
}
    `;
export const ProjectFragmentDoc = gql`
    fragment project on Project {
  id
  name
  website
  logoURL
  faviconURL
}
    `;
export const InviteFragmentDoc = gql`
    fragment invite on Invite {
  id
  email
  createdAt
}
    `;
export const SsoConfigFragmentDoc = gql`
    fragment ssoConfig on SsoConfig {
  id
  loginUrl
  logoutUrl
  ssoKey
}
    `;
export const UserFragmentDoc = gql`
    fragment user on User {
  ...userSummary
  email
  createdAt
  seenAt
  role
  stats {
    votes
    comments
  }
}
    ${UserSummaryFragmentDoc}`;
export const MeFragmentDoc = gql`
    fragment me on User {
  ...user
}
    ${UserFragmentDoc}`;
export const UsersConnectionFragmentDoc = gql`
    fragment usersConnection on UsersConnection {
  totalCount
  pageInfo {
    ...pageInfo
  }
  nodes {
    ...user
  }
}
    ${PageInfoFragmentDoc}
${UserFragmentDoc}`;
export const BoardDocument = gql`
    query board($boardId: UUID, $boardSlug: String) {
  board(id: $boardId, slug: $boardSlug) {
    ...board
  }
}
    ${BoardFragmentDoc}`;

/**
 * __useBoardQuery__
 *
 * To run a query within a React component, call `useBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      boardSlug: // value for 'boardSlug'
 *   },
 * });
 */
export function useBoardQuery(baseOptions?: Apollo.QueryHookOptions<BoardQuery, BoardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardQuery, BoardQueryVariables>(BoardDocument, options);
      }
export function useBoardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardQuery, BoardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardQuery, BoardQueryVariables>(BoardDocument, options);
        }
export type BoardQueryHookResult = ReturnType<typeof useBoardQuery>;
export type BoardLazyQueryHookResult = ReturnType<typeof useBoardLazyQuery>;
export type BoardQueryResult = Apollo.QueryResult<BoardQuery, BoardQueryVariables>;
export const BoardsDocument = gql`
    query boards {
  boards {
    ...board
  }
}
    ${BoardFragmentDoc}`;

/**
 * __useBoardsQuery__
 *
 * To run a query within a React component, call `useBoardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useBoardsQuery(baseOptions?: Apollo.QueryHookOptions<BoardsQuery, BoardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardsQuery, BoardsQueryVariables>(BoardsDocument, options);
      }
export function useBoardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardsQuery, BoardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardsQuery, BoardsQueryVariables>(BoardsDocument, options);
        }
export type BoardsQueryHookResult = ReturnType<typeof useBoardsQuery>;
export type BoardsLazyQueryHookResult = ReturnType<typeof useBoardsLazyQuery>;
export type BoardsQueryResult = Apollo.QueryResult<BoardsQuery, BoardsQueryVariables>;
export const AddBoardDocument = gql`
    mutation addBoard($input: AddBoardInput!) {
  addBoard(input: $input) {
    ...board
  }
}
    ${BoardFragmentDoc}`;
export type AddBoardMutationFn = Apollo.MutationFunction<AddBoardMutation, AddBoardMutationVariables>;

/**
 * __useAddBoardMutation__
 *
 * To run a mutation, you first call `useAddBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBoardMutation, { data, loading, error }] = useAddBoardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddBoardMutation(baseOptions?: Apollo.MutationHookOptions<AddBoardMutation, AddBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBoardMutation, AddBoardMutationVariables>(AddBoardDocument, options);
      }
export type AddBoardMutationHookResult = ReturnType<typeof useAddBoardMutation>;
export type AddBoardMutationResult = Apollo.MutationResult<AddBoardMutation>;
export type AddBoardMutationOptions = Apollo.BaseMutationOptions<AddBoardMutation, AddBoardMutationVariables>;
export const SaveBoardDocument = gql`
    mutation saveBoard($input: SaveBoardInput!) {
  saveBoard(input: $input) {
    ...board
  }
}
    ${BoardFragmentDoc}`;
export type SaveBoardMutationFn = Apollo.MutationFunction<SaveBoardMutation, SaveBoardMutationVariables>;

/**
 * __useSaveBoardMutation__
 *
 * To run a mutation, you first call `useSaveBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveBoardMutation, { data, loading, error }] = useSaveBoardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveBoardMutation(baseOptions?: Apollo.MutationHookOptions<SaveBoardMutation, SaveBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveBoardMutation, SaveBoardMutationVariables>(SaveBoardDocument, options);
      }
export type SaveBoardMutationHookResult = ReturnType<typeof useSaveBoardMutation>;
export type SaveBoardMutationResult = Apollo.MutationResult<SaveBoardMutation>;
export type SaveBoardMutationOptions = Apollo.BaseMutationOptions<SaveBoardMutation, SaveBoardMutationVariables>;
export const RemoveBoardDocument = gql`
    mutation removeBoard($input: RemoveBoardInput!) {
  removeBoard(input: $input)
}
    `;
export type RemoveBoardMutationFn = Apollo.MutationFunction<RemoveBoardMutation, RemoveBoardMutationVariables>;

/**
 * __useRemoveBoardMutation__
 *
 * To run a mutation, you first call `useRemoveBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBoardMutation, { data, loading, error }] = useRemoveBoardMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveBoardMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBoardMutation, RemoveBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBoardMutation, RemoveBoardMutationVariables>(RemoveBoardDocument, options);
      }
export type RemoveBoardMutationHookResult = ReturnType<typeof useRemoveBoardMutation>;
export type RemoveBoardMutationResult = Apollo.MutationResult<RemoveBoardMutation>;
export type RemoveBoardMutationOptions = Apollo.BaseMutationOptions<RemoveBoardMutation, RemoveBoardMutationVariables>;
export const EntryCommentsDocument = gql`
    query entryComments($entryId: UUID!, $after: String, $before: String) {
  entry(id: $entryId) {
    id
    comments(after: $after, before: $before, first: 10) {
      pageInfo {
        ...pageInfo
      }
      totalCount
      nodes {
        ...comment
      }
    }
  }
}
    ${PageInfoFragmentDoc}
${CommentFragmentDoc}`;

/**
 * __useEntryCommentsQuery__
 *
 * To run a query within a React component, call `useEntryCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntryCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntryCommentsQuery({
 *   variables: {
 *      entryId: // value for 'entryId'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useEntryCommentsQuery(baseOptions: Apollo.QueryHookOptions<EntryCommentsQuery, EntryCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntryCommentsQuery, EntryCommentsQueryVariables>(EntryCommentsDocument, options);
      }
export function useEntryCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntryCommentsQuery, EntryCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntryCommentsQuery, EntryCommentsQueryVariables>(EntryCommentsDocument, options);
        }
export type EntryCommentsQueryHookResult = ReturnType<typeof useEntryCommentsQuery>;
export type EntryCommentsLazyQueryHookResult = ReturnType<typeof useEntryCommentsLazyQuery>;
export type EntryCommentsQueryResult = Apollo.QueryResult<EntryCommentsQuery, EntryCommentsQueryVariables>;
export const AddCommentDocument = gql`
    mutation addComment($input: AddCommentInput!) {
  addComment(input: $input) {
    ...comment
  }
}
    ${CommentFragmentDoc}`;
export type AddCommentMutationFn = Apollo.MutationFunction<AddCommentMutation, AddCommentMutationVariables>;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCommentMutation, AddCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, options);
      }
export type AddCommentMutationHookResult = ReturnType<typeof useAddCommentMutation>;
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>;
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<AddCommentMutation, AddCommentMutationVariables>;
export const RemoveCommentDocument = gql`
    mutation removeComment($input: RemoveCommentInput!) {
  removeComment(input: $input)
}
    `;
export type RemoveCommentMutationFn = Apollo.MutationFunction<RemoveCommentMutation, RemoveCommentMutationVariables>;

/**
 * __useRemoveCommentMutation__
 *
 * To run a mutation, you first call `useRemoveCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCommentMutation, { data, loading, error }] = useRemoveCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveCommentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCommentMutation, RemoveCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCommentMutation, RemoveCommentMutationVariables>(RemoveCommentDocument, options);
      }
export type RemoveCommentMutationHookResult = ReturnType<typeof useRemoveCommentMutation>;
export type RemoveCommentMutationResult = Apollo.MutationResult<RemoveCommentMutation>;
export type RemoveCommentMutationOptions = Apollo.BaseMutationOptions<RemoveCommentMutation, RemoveCommentMutationVariables>;
export const VoteCommentDocument = gql`
    mutation voteComment($input: VoteCommentInput!) {
  voteComment(input: $input) {
    ...comment
  }
}
    ${CommentFragmentDoc}`;
export type VoteCommentMutationFn = Apollo.MutationFunction<VoteCommentMutation, VoteCommentMutationVariables>;

/**
 * __useVoteCommentMutation__
 *
 * To run a mutation, you first call `useVoteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteCommentMutation, { data, loading, error }] = useVoteCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVoteCommentMutation(baseOptions?: Apollo.MutationHookOptions<VoteCommentMutation, VoteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteCommentMutation, VoteCommentMutationVariables>(VoteCommentDocument, options);
      }
export type VoteCommentMutationHookResult = ReturnType<typeof useVoteCommentMutation>;
export type VoteCommentMutationResult = Apollo.MutationResult<VoteCommentMutation>;
export type VoteCommentMutationOptions = Apollo.BaseMutationOptions<VoteCommentMutation, VoteCommentMutationVariables>;
export const SaveCommentDocument = gql`
    mutation saveComment($input: SaveCommentInput!) {
  saveComment(input: $input) {
    ...comment
  }
}
    ${CommentFragmentDoc}`;
export type SaveCommentMutationFn = Apollo.MutationFunction<SaveCommentMutation, SaveCommentMutationVariables>;

/**
 * __useSaveCommentMutation__
 *
 * To run a mutation, you first call `useSaveCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveCommentMutation, { data, loading, error }] = useSaveCommentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveCommentMutation(baseOptions?: Apollo.MutationHookOptions<SaveCommentMutation, SaveCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveCommentMutation, SaveCommentMutationVariables>(SaveCommentDocument, options);
      }
export type SaveCommentMutationHookResult = ReturnType<typeof useSaveCommentMutation>;
export type SaveCommentMutationResult = Apollo.MutationResult<SaveCommentMutation>;
export type SaveCommentMutationOptions = Apollo.BaseMutationOptions<SaveCommentMutation, SaveCommentMutationVariables>;
export const EntryDocument = gql`
    query entry($id: UUID!) {
  entry(id: $id) {
    ...entry
  }
}
    ${EntryFragmentDoc}`;

/**
 * __useEntryQuery__
 *
 * To run a query within a React component, call `useEntryQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEntryQuery(baseOptions: Apollo.QueryHookOptions<EntryQuery, EntryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntryQuery, EntryQueryVariables>(EntryDocument, options);
      }
export function useEntryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntryQuery, EntryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntryQuery, EntryQueryVariables>(EntryDocument, options);
        }
export type EntryQueryHookResult = ReturnType<typeof useEntryQuery>;
export type EntryLazyQueryHookResult = ReturnType<typeof useEntryLazyQuery>;
export type EntryQueryResult = Apollo.QueryResult<EntryQuery, EntryQueryVariables>;
export const LookupEntryDocument = gql`
    query lookupEntry($boardSlug: String!, $entrySlug: String!) {
  lookupEntry(boardSlug: $boardSlug, entrySlug: $entrySlug) {
    ...entry
  }
}
    ${EntryFragmentDoc}`;

/**
 * __useLookupEntryQuery__
 *
 * To run a query within a React component, call `useLookupEntryQuery` and pass it any options that fit your needs.
 * When your component renders, `useLookupEntryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLookupEntryQuery({
 *   variables: {
 *      boardSlug: // value for 'boardSlug'
 *      entrySlug: // value for 'entrySlug'
 *   },
 * });
 */
export function useLookupEntryQuery(baseOptions: Apollo.QueryHookOptions<LookupEntryQuery, LookupEntryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LookupEntryQuery, LookupEntryQueryVariables>(LookupEntryDocument, options);
      }
export function useLookupEntryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LookupEntryQuery, LookupEntryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LookupEntryQuery, LookupEntryQueryVariables>(LookupEntryDocument, options);
        }
export type LookupEntryQueryHookResult = ReturnType<typeof useLookupEntryQuery>;
export type LookupEntryLazyQueryHookResult = ReturnType<typeof useLookupEntryLazyQuery>;
export type LookupEntryQueryResult = Apollo.QueryResult<LookupEntryQuery, LookupEntryQueryVariables>;
export const EntriesDocument = gql`
    query entries($input: EntriesInput, $orderBy: EntriesOrderByInput, $after: String, $before: String) {
  entries(input: $input, orderBy: $orderBy, after: $after, before: $before) {
    ...entriesConnection
  }
}
    ${EntriesConnectionFragmentDoc}`;

/**
 * __useEntriesQuery__
 *
 * To run a query within a React component, call `useEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntriesQuery({
 *   variables: {
 *      input: // value for 'input'
 *      orderBy: // value for 'orderBy'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useEntriesQuery(baseOptions?: Apollo.QueryHookOptions<EntriesQuery, EntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntriesQuery, EntriesQueryVariables>(EntriesDocument, options);
      }
export function useEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntriesQuery, EntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntriesQuery, EntriesQueryVariables>(EntriesDocument, options);
        }
export type EntriesQueryHookResult = ReturnType<typeof useEntriesQuery>;
export type EntriesLazyQueryHookResult = ReturnType<typeof useEntriesLazyQuery>;
export type EntriesQueryResult = Apollo.QueryResult<EntriesQuery, EntriesQueryVariables>;
export const EntryUpvotersDocument = gql`
    query entryUpvoters($entryId: UUID!, $after: String, $before: String) {
  entry(id: $entryId) {
    id
    upvoters(after: $after, before: $before) {
      totalCount
      pageInfo {
        ...pageInfo
      }
      nodes {
        ...user
      }
    }
  }
}
    ${PageInfoFragmentDoc}
${UserFragmentDoc}`;

/**
 * __useEntryUpvotersQuery__
 *
 * To run a query within a React component, call `useEntryUpvotersQuery` and pass it any options that fit your needs.
 * When your component renders, `useEntryUpvotersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEntryUpvotersQuery({
 *   variables: {
 *      entryId: // value for 'entryId'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useEntryUpvotersQuery(baseOptions: Apollo.QueryHookOptions<EntryUpvotersQuery, EntryUpvotersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EntryUpvotersQuery, EntryUpvotersQueryVariables>(EntryUpvotersDocument, options);
      }
export function useEntryUpvotersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EntryUpvotersQuery, EntryUpvotersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EntryUpvotersQuery, EntryUpvotersQueryVariables>(EntryUpvotersDocument, options);
        }
export type EntryUpvotersQueryHookResult = ReturnType<typeof useEntryUpvotersQuery>;
export type EntryUpvotersLazyQueryHookResult = ReturnType<typeof useEntryUpvotersLazyQuery>;
export type EntryUpvotersQueryResult = Apollo.QueryResult<EntryUpvotersQuery, EntryUpvotersQueryVariables>;
export const AddEntryDocument = gql`
    mutation addEntry($input: AddEntryInput!) {
  addEntry(input: $input) {
    ...entry
  }
}
    ${EntryFragmentDoc}`;
export type AddEntryMutationFn = Apollo.MutationFunction<AddEntryMutation, AddEntryMutationVariables>;

/**
 * __useAddEntryMutation__
 *
 * To run a mutation, you first call `useAddEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEntryMutation, { data, loading, error }] = useAddEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddEntryMutation(baseOptions?: Apollo.MutationHookOptions<AddEntryMutation, AddEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEntryMutation, AddEntryMutationVariables>(AddEntryDocument, options);
      }
export type AddEntryMutationHookResult = ReturnType<typeof useAddEntryMutation>;
export type AddEntryMutationResult = Apollo.MutationResult<AddEntryMutation>;
export type AddEntryMutationOptions = Apollo.BaseMutationOptions<AddEntryMutation, AddEntryMutationVariables>;
export const SaveEntryDocument = gql`
    mutation saveEntry($input: SaveEntryInput!) {
  saveEntry(input: $input) {
    ...entry
  }
}
    ${EntryFragmentDoc}`;
export type SaveEntryMutationFn = Apollo.MutationFunction<SaveEntryMutation, SaveEntryMutationVariables>;

/**
 * __useSaveEntryMutation__
 *
 * To run a mutation, you first call `useSaveEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveEntryMutation, { data, loading, error }] = useSaveEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveEntryMutation(baseOptions?: Apollo.MutationHookOptions<SaveEntryMutation, SaveEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveEntryMutation, SaveEntryMutationVariables>(SaveEntryDocument, options);
      }
export type SaveEntryMutationHookResult = ReturnType<typeof useSaveEntryMutation>;
export type SaveEntryMutationResult = Apollo.MutationResult<SaveEntryMutation>;
export type SaveEntryMutationOptions = Apollo.BaseMutationOptions<SaveEntryMutation, SaveEntryMutationVariables>;
export const RemoveEntryDocument = gql`
    mutation removeEntry($input: RemoveEntryInput!) {
  removeEntry(input: $input)
}
    `;
export type RemoveEntryMutationFn = Apollo.MutationFunction<RemoveEntryMutation, RemoveEntryMutationVariables>;

/**
 * __useRemoveEntryMutation__
 *
 * To run a mutation, you first call `useRemoveEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEntryMutation, { data, loading, error }] = useRemoveEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveEntryMutation(baseOptions?: Apollo.MutationHookOptions<RemoveEntryMutation, RemoveEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveEntryMutation, RemoveEntryMutationVariables>(RemoveEntryDocument, options);
      }
export type RemoveEntryMutationHookResult = ReturnType<typeof useRemoveEntryMutation>;
export type RemoveEntryMutationResult = Apollo.MutationResult<RemoveEntryMutation>;
export type RemoveEntryMutationOptions = Apollo.BaseMutationOptions<RemoveEntryMutation, RemoveEntryMutationVariables>;
export const VoteEntryDocument = gql`
    mutation voteEntry($input: VoteEntryInput!) {
  voteEntry(input: $input) {
    ...entry
  }
}
    ${EntryFragmentDoc}`;
export type VoteEntryMutationFn = Apollo.MutationFunction<VoteEntryMutation, VoteEntryMutationVariables>;

/**
 * __useVoteEntryMutation__
 *
 * To run a mutation, you first call `useVoteEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteEntryMutation, { data, loading, error }] = useVoteEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVoteEntryMutation(baseOptions?: Apollo.MutationHookOptions<VoteEntryMutation, VoteEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteEntryMutation, VoteEntryMutationVariables>(VoteEntryDocument, options);
      }
export type VoteEntryMutationHookResult = ReturnType<typeof useVoteEntryMutation>;
export type VoteEntryMutationResult = Apollo.MutationResult<VoteEntryMutation>;
export type VoteEntryMutationOptions = Apollo.BaseMutationOptions<VoteEntryMutation, VoteEntryMutationVariables>;
export const ConfigDocument = gql`
    query config {
  config {
    ...config
  }
}
    ${ConfigFragmentDoc}`;

/**
 * __useConfigQuery__
 *
 * To run a query within a React component, call `useConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfigQuery(baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
      }
export function useConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
        }
export type ConfigQueryHookResult = ReturnType<typeof useConfigQuery>;
export type ConfigLazyQueryHookResult = ReturnType<typeof useConfigLazyQuery>;
export type ConfigQueryResult = Apollo.QueryResult<ConfigQuery, ConfigQueryVariables>;
export const ProjectDocument = gql`
    query project($includeDetails: Boolean! = false) {
  project {
    ...project
    ssoConfig @include(if: $includeDetails) {
      ...ssoConfig
    }
  }
}
    ${ProjectFragmentDoc}
${SsoConfigFragmentDoc}`;

/**
 * __useProjectQuery__
 *
 * To run a query within a React component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectQuery({
 *   variables: {
 *      includeDetails: // value for 'includeDetails'
 *   },
 * });
 */
export function useProjectQuery(baseOptions?: Apollo.QueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
      }
export function useProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectQuery, ProjectQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, options);
        }
export type ProjectQueryHookResult = ReturnType<typeof useProjectQuery>;
export type ProjectLazyQueryHookResult = ReturnType<typeof useProjectLazyQuery>;
export type ProjectQueryResult = Apollo.QueryResult<ProjectQuery, ProjectQueryVariables>;
export const SaveProjectDocument = gql`
    mutation saveProject($input: SaveProjectInput!) {
  saveProject(input: $input) {
    ...project
  }
}
    ${ProjectFragmentDoc}`;
export type SaveProjectMutationFn = Apollo.MutationFunction<SaveProjectMutation, SaveProjectMutationVariables>;

/**
 * __useSaveProjectMutation__
 *
 * To run a mutation, you first call `useSaveProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveProjectMutation, { data, loading, error }] = useSaveProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveProjectMutation(baseOptions?: Apollo.MutationHookOptions<SaveProjectMutation, SaveProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveProjectMutation, SaveProjectMutationVariables>(SaveProjectDocument, options);
      }
export type SaveProjectMutationHookResult = ReturnType<typeof useSaveProjectMutation>;
export type SaveProjectMutationResult = Apollo.MutationResult<SaveProjectMutation>;
export type SaveProjectMutationOptions = Apollo.BaseMutationOptions<SaveProjectMutation, SaveProjectMutationVariables>;
export const LookupInviteDocument = gql`
    query lookupInvite($token: String!) {
  lookupInvite(token: $token) {
    ...invite
  }
}
    ${InviteFragmentDoc}`;

/**
 * __useLookupInviteQuery__
 *
 * To run a query within a React component, call `useLookupInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useLookupInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLookupInviteQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useLookupInviteQuery(baseOptions: Apollo.QueryHookOptions<LookupInviteQuery, LookupInviteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LookupInviteQuery, LookupInviteQueryVariables>(LookupInviteDocument, options);
      }
export function useLookupInviteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LookupInviteQuery, LookupInviteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LookupInviteQuery, LookupInviteQueryVariables>(LookupInviteDocument, options);
        }
export type LookupInviteQueryHookResult = ReturnType<typeof useLookupInviteQuery>;
export type LookupInviteLazyQueryHookResult = ReturnType<typeof useLookupInviteLazyQuery>;
export type LookupInviteQueryResult = Apollo.QueryResult<LookupInviteQuery, LookupInviteQueryVariables>;
export const ProjectMembersAndInvitesDocument = gql`
    query projectMembersAndInvites {
  members {
    ...user
  }
  invites {
    ...invite
    token
  }
}
    ${UserFragmentDoc}
${InviteFragmentDoc}`;

/**
 * __useProjectMembersAndInvitesQuery__
 *
 * To run a query within a React component, call `useProjectMembersAndInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectMembersAndInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectMembersAndInvitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useProjectMembersAndInvitesQuery(baseOptions?: Apollo.QueryHookOptions<ProjectMembersAndInvitesQuery, ProjectMembersAndInvitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectMembersAndInvitesQuery, ProjectMembersAndInvitesQueryVariables>(ProjectMembersAndInvitesDocument, options);
      }
export function useProjectMembersAndInvitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectMembersAndInvitesQuery, ProjectMembersAndInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectMembersAndInvitesQuery, ProjectMembersAndInvitesQueryVariables>(ProjectMembersAndInvitesDocument, options);
        }
export type ProjectMembersAndInvitesQueryHookResult = ReturnType<typeof useProjectMembersAndInvitesQuery>;
export type ProjectMembersAndInvitesLazyQueryHookResult = ReturnType<typeof useProjectMembersAndInvitesLazyQuery>;
export type ProjectMembersAndInvitesQueryResult = Apollo.QueryResult<ProjectMembersAndInvitesQuery, ProjectMembersAndInvitesQueryVariables>;
export const RemoveUserDocument = gql`
    mutation removeUser($input: RemoveUserInput!) {
  removeUser(input: $input)
}
    `;
export type RemoveUserMutationFn = Apollo.MutationFunction<RemoveUserMutation, RemoveUserMutationVariables>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(RemoveUserDocument, options);
      }
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<RemoveUserMutation, RemoveUserMutationVariables>;
export const AddInviteDocument = gql`
    mutation addInvite($input: AddInviteInput!) {
  addInvite(input: $input) {
    id
  }
}
    `;
export type AddInviteMutationFn = Apollo.MutationFunction<AddInviteMutation, AddInviteMutationVariables>;

/**
 * __useAddInviteMutation__
 *
 * To run a mutation, you first call `useAddInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addInviteMutation, { data, loading, error }] = useAddInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddInviteMutation(baseOptions?: Apollo.MutationHookOptions<AddInviteMutation, AddInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddInviteMutation, AddInviteMutationVariables>(AddInviteDocument, options);
      }
export type AddInviteMutationHookResult = ReturnType<typeof useAddInviteMutation>;
export type AddInviteMutationResult = Apollo.MutationResult<AddInviteMutation>;
export type AddInviteMutationOptions = Apollo.BaseMutationOptions<AddInviteMutation, AddInviteMutationVariables>;
export const RemoveInviteDocument = gql`
    mutation removeInvite($input: RemoveInviteInput!) {
  removeInvite(input: $input)
}
    `;
export type RemoveInviteMutationFn = Apollo.MutationFunction<RemoveInviteMutation, RemoveInviteMutationVariables>;

/**
 * __useRemoveInviteMutation__
 *
 * To run a mutation, you first call `useRemoveInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeInviteMutation, { data, loading, error }] = useRemoveInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveInviteMutation(baseOptions?: Apollo.MutationHookOptions<RemoveInviteMutation, RemoveInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveInviteMutation, RemoveInviteMutationVariables>(RemoveInviteDocument, options);
      }
export type RemoveInviteMutationHookResult = ReturnType<typeof useRemoveInviteMutation>;
export type RemoveInviteMutationResult = Apollo.MutationResult<RemoveInviteMutation>;
export type RemoveInviteMutationOptions = Apollo.BaseMutationOptions<RemoveInviteMutation, RemoveInviteMutationVariables>;
export const SaveSsoConfigDocument = gql`
    mutation saveSsoConfig($input: SaveSsoConfigInput!) {
  saveSsoConfig(input: $input) {
    ...ssoConfig
  }
}
    ${SsoConfigFragmentDoc}`;
export type SaveSsoConfigMutationFn = Apollo.MutationFunction<SaveSsoConfigMutation, SaveSsoConfigMutationVariables>;

/**
 * __useSaveSsoConfigMutation__
 *
 * To run a mutation, you first call `useSaveSsoConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveSsoConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveSsoConfigMutation, { data, loading, error }] = useSaveSsoConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveSsoConfigMutation(baseOptions?: Apollo.MutationHookOptions<SaveSsoConfigMutation, SaveSsoConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveSsoConfigMutation, SaveSsoConfigMutationVariables>(SaveSsoConfigDocument, options);
      }
export type SaveSsoConfigMutationHookResult = ReturnType<typeof useSaveSsoConfigMutation>;
export type SaveSsoConfigMutationResult = Apollo.MutationResult<SaveSsoConfigMutation>;
export type SaveSsoConfigMutationOptions = Apollo.BaseMutationOptions<SaveSsoConfigMutation, SaveSsoConfigMutationVariables>;
export const StatusesDocument = gql`
    query statuses {
  statuses {
    ...status
  }
}
    ${StatusFragmentDoc}`;

/**
 * __useStatusesQuery__
 *
 * To run a query within a React component, call `useStatusesQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatusesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatusesQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatusesQuery(baseOptions?: Apollo.QueryHookOptions<StatusesQuery, StatusesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatusesQuery, StatusesQueryVariables>(StatusesDocument, options);
      }
export function useStatusesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatusesQuery, StatusesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatusesQuery, StatusesQueryVariables>(StatusesDocument, options);
        }
export type StatusesQueryHookResult = ReturnType<typeof useStatusesQuery>;
export type StatusesLazyQueryHookResult = ReturnType<typeof useStatusesLazyQuery>;
export type StatusesQueryResult = Apollo.QueryResult<StatusesQuery, StatusesQueryVariables>;
export const AddStatusDocument = gql`
    mutation addStatus($input: AddStatusInput!) {
  addStatus(input: $input) {
    ...status
  }
}
    ${StatusFragmentDoc}`;
export type AddStatusMutationFn = Apollo.MutationFunction<AddStatusMutation, AddStatusMutationVariables>;

/**
 * __useAddStatusMutation__
 *
 * To run a mutation, you first call `useAddStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStatusMutation, { data, loading, error }] = useAddStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddStatusMutation(baseOptions?: Apollo.MutationHookOptions<AddStatusMutation, AddStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddStatusMutation, AddStatusMutationVariables>(AddStatusDocument, options);
      }
export type AddStatusMutationHookResult = ReturnType<typeof useAddStatusMutation>;
export type AddStatusMutationResult = Apollo.MutationResult<AddStatusMutation>;
export type AddStatusMutationOptions = Apollo.BaseMutationOptions<AddStatusMutation, AddStatusMutationVariables>;
export const SaveStatusDocument = gql`
    mutation saveStatus($input: SaveStatusInput!) {
  saveStatus(input: $input) {
    ...status
  }
}
    ${StatusFragmentDoc}`;
export type SaveStatusMutationFn = Apollo.MutationFunction<SaveStatusMutation, SaveStatusMutationVariables>;

/**
 * __useSaveStatusMutation__
 *
 * To run a mutation, you first call `useSaveStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveStatusMutation, { data, loading, error }] = useSaveStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveStatusMutation(baseOptions?: Apollo.MutationHookOptions<SaveStatusMutation, SaveStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveStatusMutation, SaveStatusMutationVariables>(SaveStatusDocument, options);
      }
export type SaveStatusMutationHookResult = ReturnType<typeof useSaveStatusMutation>;
export type SaveStatusMutationResult = Apollo.MutationResult<SaveStatusMutation>;
export type SaveStatusMutationOptions = Apollo.BaseMutationOptions<SaveStatusMutation, SaveStatusMutationVariables>;
export const RemoveStatusDocument = gql`
    mutation removeStatus($input: RemoveStatusInput!) {
  removeStatus(input: $input)
}
    `;
export type RemoveStatusMutationFn = Apollo.MutationFunction<RemoveStatusMutation, RemoveStatusMutationVariables>;

/**
 * __useRemoveStatusMutation__
 *
 * To run a mutation, you first call `useRemoveStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStatusMutation, { data, loading, error }] = useRemoveStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveStatusMutation(baseOptions?: Apollo.MutationHookOptions<RemoveStatusMutation, RemoveStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveStatusMutation, RemoveStatusMutationVariables>(RemoveStatusDocument, options);
      }
export type RemoveStatusMutationHookResult = ReturnType<typeof useRemoveStatusMutation>;
export type RemoveStatusMutationResult = Apollo.MutationResult<RemoveStatusMutation>;
export type RemoveStatusMutationOptions = Apollo.BaseMutationOptions<RemoveStatusMutation, RemoveStatusMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...me
  }
}
    ${MeFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const LoginDocument = gql`
    mutation login($input: LoginInput!) {
  login(input: $input)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation register($input: RegisterInput!) {
  register(input: $input) {
    id
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SaveMemberDocument = gql`
    mutation saveMember($input: SaveUserInput!) {
  saveUser(input: $input) {
    ...me
  }
}
    ${MeFragmentDoc}`;
export type SaveMemberMutationFn = Apollo.MutationFunction<SaveMemberMutation, SaveMemberMutationVariables>;

/**
 * __useSaveMemberMutation__
 *
 * To run a mutation, you first call `useSaveMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveMemberMutation, { data, loading, error }] = useSaveMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveMemberMutation(baseOptions?: Apollo.MutationHookOptions<SaveMemberMutation, SaveMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveMemberMutation, SaveMemberMutationVariables>(SaveMemberDocument, options);
      }
export type SaveMemberMutationHookResult = ReturnType<typeof useSaveMemberMutation>;
export type SaveMemberMutationResult = Apollo.MutationResult<SaveMemberMutation>;
export type SaveMemberMutationOptions = Apollo.BaseMutationOptions<SaveMemberMutation, SaveMemberMutationVariables>;
export const SavePasswordDocument = gql`
    mutation savePassword($input: SavePasswordInput!) {
  savePassword(input: $input)
}
    `;
export type SavePasswordMutationFn = Apollo.MutationFunction<SavePasswordMutation, SavePasswordMutationVariables>;

/**
 * __useSavePasswordMutation__
 *
 * To run a mutation, you first call `useSavePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSavePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [savePasswordMutation, { data, loading, error }] = useSavePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSavePasswordMutation(baseOptions?: Apollo.MutationHookOptions<SavePasswordMutation, SavePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SavePasswordMutation, SavePasswordMutationVariables>(SavePasswordDocument, options);
      }
export type SavePasswordMutationHookResult = ReturnType<typeof useSavePasswordMutation>;
export type SavePasswordMutationResult = Apollo.MutationResult<SavePasswordMutation>;
export type SavePasswordMutationOptions = Apollo.BaseMutationOptions<SavePasswordMutation, SavePasswordMutationVariables>;
export const UserDocument = gql`
    query user($id: UUID!) {
  user(id: $id) {
    ...user
  }
}
    ${UserFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query users($orderBy: UsersOrderByInput, $input: UsersInput, $after: String, $before: String) {
  users(orderBy: $orderBy, input: $input, after: $after, before: $before) {
    ...usersConnection
  }
}
    ${UsersConnectionFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      input: // value for 'input'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const MembersDocument = gql`
    query members {
  members {
    ...user
  }
}
    ${UserFragmentDoc}`;

/**
 * __useMembersQuery__
 *
 * To run a query within a React component, call `useMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersQuery({
 *   variables: {
 *   },
 * });
 */
export function useMembersQuery(baseOptions?: Apollo.QueryHookOptions<MembersQuery, MembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MembersQuery, MembersQueryVariables>(MembersDocument, options);
      }
export function useMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MembersQuery, MembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MembersQuery, MembersQueryVariables>(MembersDocument, options);
        }
export type MembersQueryHookResult = ReturnType<typeof useMembersQuery>;
export type MembersLazyQueryHookResult = ReturnType<typeof useMembersLazyQuery>;
export type MembersQueryResult = Apollo.QueryResult<MembersQuery, MembersQueryVariables>;