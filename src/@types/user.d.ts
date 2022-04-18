/* eslint-disable @typescript-eslint/no-empty-interface */
declare namespace UserNamespace {
  interface IAccessToken {
    userId: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
  }

  interface Info {
    id: string;
    username: string;
    email: string;
  }
}
