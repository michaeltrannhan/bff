export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  facebookId: string;
  appleId: string;
  passwordChangedAt: Date;
  hashedPassword: string;
  //   confirmed: boolean;
  //   credentials: ICredentials;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;
}
