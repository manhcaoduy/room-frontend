import { http } from "../http/http";
import {
  ConnectRequest,
  ConnectResponse,
  DisconnectRequest,
  DisconnectResponse,
  GenerateNonceMessageRequest,
  GenerateNonceMessageResponse,
  GetWalletsResponse,
} from "./user-wallet.dto";

export default class UserWalletService {
  private static instance?: UserWalletService;

  public static getInstance(): UserWalletService {
    if (!UserWalletService.instance)
      UserWalletService.instance = new UserWalletService();
    return UserWalletService.instance;
  }

  public async getWallets(): Promise<GetWalletsResponse> {
    const res = await http.get("/user-wallet");
    return Object(res.data);
  }

  public async generateNonceMessage({
    walletAddress,
    network,
  }: GenerateNonceMessageRequest): Promise<GenerateNonceMessageResponse> {
    const res = await http.post("/user-wallet/generate-nonce-message", {
      walletAddress,
      network,
    });
    return Object(res.data);
  }

  public async connect({
    walletAddress,
    network,
    signature,
  }: ConnectRequest): Promise<ConnectResponse> {
    const res = await http.post("/user-wallet/connect", {
      walletAddress,
      network,
      signature,
    });
    return Object(res.data);
  }

  public async disconnect({
    walletAddress,
    network,
  }: DisconnectRequest): Promise<DisconnectResponse> {
    const res = await http.post("/user-wallet/disconnect", {
      walletAddress,
      network,
    });
    return Object(res.data);
  }
}
