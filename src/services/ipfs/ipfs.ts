import { create, IPFSHTTPClient } from "ipfs-http-client";

export default class IpfsService {
  private static instance?: IpfsService;
  private client: IPFSHTTPClient;

  constructor() {
    // todo: remove this hardcore
    this.client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  }

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService();
    }
    return IpfsService.instance;
  }

  public async process(req: {
    name: string;
    description: string;
    file: File;
  }): Promise<string> {
    const { name, description, file } = req;
    const { path: fileIpfsPath } = await this.client.add(file);
    const fileIpfsUrl = `https://ipfs.infura.io/ipfs/${fileIpfsPath}`;
    const metadata = {
      name,
      description,
      url: fileIpfsUrl,
    };
    const { path: metadataIpfsPath } = await this.client.add(
      JSON.stringify(metadata)
    );
    return metadataIpfsPath;
  }
}
