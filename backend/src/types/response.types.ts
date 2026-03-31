export interface IApiResponse<T> {
  succes: boolean;
  data: T;
  message?: string;
}

// export interface IAuthResponse {
//   email: string;
//   name: string;
//   password: string;
// }
