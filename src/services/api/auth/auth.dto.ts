export interface UserInfo {
  id: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
