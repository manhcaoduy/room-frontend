import { parseUserData } from '../../helpers/data.helpers';
import { ENUM } from '../../resources/constants/enum';
import { http } from './http';

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance?: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  public hasLocalStorageAccessToken(): boolean {
    return (
      !!localStorage.getItem(ENUM.auth.accessTokenStorageKey) &&
      !!localStorage.getItem(ENUM.auth.refreshTokenStorageKey)
    );
  }

  public async login({
    email,
    password,
  }: ILoginRequest): Promise<ILoginResponse> {
    const res = await http.post('/auth/login', { email, password });
    const data = Object(res.data);
    const accessToken = String(data.accessToken);
    const refreshToken = String(data.refreshToken);
    if (accessToken && refreshToken) {
      localStorage.setItem(ENUM.auth.accessTokenStorageKey, accessToken);
      localStorage.setItem(ENUM.auth.refreshTokenStorageKey, refreshToken);
      http.setToken(accessToken);
    }
    return { accessToken, refreshToken };
  }

  public async getProfile(): Promise<UserNamespace.Info> {
    const res = await http.post('/auth/me', {});
    const profile = parseUserData(Object(res.data).user);
    return profile;
  }
}

export default AuthService;
