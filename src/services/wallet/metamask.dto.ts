import { UserWallet } from "../api/user-wallet/user-wallet.dto";

export interface LinkWalletResponse {
  userWallet: UserWallet;
}

export interface DisconnectWalletRequest {
  walletAddress: string;
}

export interface DisconnectWalletResponse {
  result: boolean;
}

export interface UploadItemRequest {
  metadataIpfs: string;
}

export interface UploadItemResponse {
  txHash: string;
  tokenId: number;
  owner: string;
}

export interface EnableSellingItemRequest {
  tokenId: number;
  price: number;
}

export interface EnableSellingItemResponse {
  price: number;
  marketItemId: number;
  walletAddress: string;
}

export interface CancelItemRequest {
  marketItemId: number;
}

export interface CancelItemResponse {
  walletAddress: string;
}

export interface BuyItemRequest {
  marketItemId: number;
  price: number;
}

export interface BuyItemResponse {
  txHash: string;
  price: number;
  seller: string;
  buyer: string;
}
