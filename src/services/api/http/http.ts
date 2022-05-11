/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from "axios";
import { ENVS } from "../../../envs/config.develop";
import { ENUM } from "../../../resources/constants/enum";

const TIMEOUT = 30000;

interface IRefreshTokenParams {
  currentRefreshToken: string;
}
interface IRefreshTokenResponse {
  refreshToken: string;
  accessToken: string;
}
interface IMiddlewareParams {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  params?: Record<string, unknown>;
}

class httpService {
  private token?: string;

  public setToken(tkn: string): void {
    this.token = tkn;
  }

  public async get(
    url: string,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const res = await this.middleware({
      method: "GET",
      url: `${ENVS.apiBaseUrl}${url}`,
      params: body,
    });
    return res;
  }

  public async post(
    url: string,
    body: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const res = await this.middleware({
      method: "POST",
      url: `${ENVS.apiBaseUrl}${url}`,
      params: body,
    });
    return res;
  }

  public async put(
    url: string,
    body: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const res = await this.middleware({
      method: "PUT",
      url: `${ENVS.apiBaseUrl}${url}`,
      params: body,
    });
    return res;
  }

  public async patch(
    url: string,
    body: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const res = await this.middleware({
      method: "PATCH",
      url: `${ENVS.apiBaseUrl}${url}`,
      params: body,
    });
    return res;
  }

  public async delete(url: string): Promise<Record<string, unknown>> {
    const res = await this.middleware({
      method: "DELETE",
      url: `${ENVS.apiBaseUrl}${url}`,
    });
    return res;
  }

  private get config(): Record<string, unknown> {
    return this.token
      ? {
          timeout: TIMEOUT,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      : {
          timeout: TIMEOUT,
        };
  }

  private async middleware({
    url,
    method,
    params,
  }: IMiddlewareParams): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      const handleRequest = async (): Promise<void> => {
        switch (method) {
          case "GET": {
            const res = await axios.get(url, { ...this.config, params });
            resolve(res.data);
            break;
          }
          case "POST": {
            const res = await axios.post(url, params, this.config);
            resolve(res.data);
            break;
          }
          case "PUT": {
            const res = await axios.put(url, params, this.config);
            resolve(res.data);
            break;
          }
          case "PATCH": {
            const res = await axios.patch(url, params, this.config);
            resolve(res.data);
            break;
          }
          case "DELETE": {
            const res = await axios.delete(url, this.config);
            resolve(res.data);
            break;
          }
          default:
            reject();
            break;
        }
      };

      const exec = async (): Promise<void> => {
        try {
          await handleRequest();
        } catch (e: any) {
          console.log("ERROR", e);
          // Logger.log('ERROR', e);
          const statusCode = Object(Object(e).response).status;
          if (statusCode !== 401) reject(e);
          else {
            const authRefreshToken = localStorage.getItem(
              ENUM.auth.refreshTokenStorageKey
            );
            if (!authRefreshToken) reject(e);
            else {
              try {
                const { accessToken, refreshToken } = await this.refreshToken({
                  currentRefreshToken: authRefreshToken,
                });
                localStorage.setItem(
                  ENUM.auth.accessTokenStorageKey,
                  accessToken
                );
                localStorage.setItem(
                  ENUM.auth.refreshTokenStorageKey,
                  refreshToken
                );
                this.setToken(accessToken);
              } catch (err) {
                localStorage.removeItem(ENUM.auth.accessTokenStorageKey);
                localStorage.removeItem(ENUM.auth.refreshTokenStorageKey);
                // Logger.log('Can not refresh authenticated token.');
                console.log("Can not refresh authenticated token.");
                localStorage.clear();
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }

              try {
                await handleRequest();
              } catch (err) {
                // Logger.log('ERROR', err);
                console.log("ERROR", err);
                reject(err);
              }
            }
          }
        }
      };
      exec();
    });
  }

  public async refreshToken({
    currentRefreshToken,
  }: IRefreshTokenParams): Promise<IRefreshTokenResponse> {
    try {
      const res = await axios.post(
        `${ENVS.apiBaseUrl}/auth/refresh-token`,
        {},
        {
          timeout: TIMEOUT,
          headers: {
            Authorization: `Bearer ${currentRefreshToken}`,
          },
        }
      );
      const data = Object(res.data).data;
      return {
        accessToken: String(data.accessToken),
        refreshToken: String(data.refreshToken),
      };
    } catch (e) {
      // Logger.log('ERROR', e);
      console.log("ERROR", e);
      throw new Error("refreshTokenFailed");
    }
  }
}

export const http = new httpService();
export default httpService;
