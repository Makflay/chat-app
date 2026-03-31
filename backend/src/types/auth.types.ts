export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponseData {
  id: number;
  name: string;
  role: string;
  token: string;
}
