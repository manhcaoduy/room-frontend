import { parseUserData } from "../../../helpers/data.helpers";
import { ENUM } from "../../../resources/constants/enum";
import { http } from "../http/http";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
} from "./auth.dto";

export default class AuthService {
  private static instance?: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService();
    return AuthService.instance;
  }

  public async login({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse> {
    const res = await http.post("/auth/login", { email, password });
    return this.extractAndSaveToken(res);
  }

  public async register({
    email,
    password,
    username,
  }: RegisterRequest): Promise<RegisterResponse> {
    const res = await http.post("/auth/register", {
      email,
      password,
      username,
    });
    return this.extractAndSaveToken(res);
  }

  public async getProfile(): Promise<UserInfo | undefined> {
    try {
      const res = await http.get("/auth/me");
      return parseUserData(Object(res.data));
    } catch (error) {
      return undefined;
    }
  }

  public async logout(): Promise<void> {
    await http.post("/auth/logout", {});
  }

  private extractAndSaveToken(res: Record<string, unknown>): {
    accessToken: string;
    refreshToken: string;
  } {
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
}
