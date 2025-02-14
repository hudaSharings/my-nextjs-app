export type SessionPayload = {
  userId: string;
  expiresAt: Date;
  userInfo: UserInfo;
};
export type UserInfo = {
  userName: string;
  name: string;
  email: string;
  avatar: string;
  OrgIg: string;
};
