import axios from "axios";
import { ENVS } from "../../envs/config.develop";
import { Asset } from "./opensea.dto";
import { plainToClass, plainToInstance } from "class-transformer";

interface IGetAssesRequest {
  owner: string;
}

interface IGetAssetsResponse {
  assets: Asset[];
}

export default class OpenseaService {
  private static instance?: OpenseaService;

  public static getInstance(): OpenseaService {
    if (!OpenseaService.instance)
      OpenseaService.instance = new OpenseaService();
    return OpenseaService.instance;
  }

  public async getAssets(
    request: IGetAssesRequest
  ): Promise<IGetAssetsResponse> {
    const assets: Asset[] = [];

    const { owner } = request;

    const url = `${ENVS.openseaApiBaseUrl}/assets`;
    const params = {
      owner,
    };
    const { data } = await axios.get(url, { params });
    const { assets: plainAssets } = data;

    plainAssets.forEach((plainAsset: any) => {
      const asset = plainToInstance(Asset, plainAsset);
      assets.push(asset);
    });

    return { assets };
  }
}
