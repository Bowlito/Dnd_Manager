export interface IUser {
  _id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: IUser;
}