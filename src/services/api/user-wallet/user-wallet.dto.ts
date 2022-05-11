import { WalletTypeEnum } from "../../../resources/constants/enum";

export interface UserWallet {
  id: string;
  userId: string;
  address: string;
  network: WalletTypeEnum;
}

export interface GetWalletsResponse {
  userWallets: UserWallet[];
}

export interface GenerateNonceMessageRequest {
  walletAddress: string;
  network: WalletTypeEnum;
}

export interface GenerateNonceMessageResponse {
  message: string;
}

export interface ConnectRequest {
  walletAddress: string;
  network: WalletTypeEnum;
  signature: string;
}

export interface ConnectResponse {
  userWallet: UserWallet;
}

export interface DisconnectRequest {
  walletAddress: string;
  network: WalletTypeEnum;
}

export interface DisconnectResponse {
  result: boolean;
}
