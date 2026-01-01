
export interface IUser {
  email: string;
  passwordHash: string;
  role: 'owner' | 'admin';
}
