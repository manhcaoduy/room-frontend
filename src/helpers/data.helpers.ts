import axios from "axios";
import { MetadataIpfs } from "../components/utils/item-card/item-card.interface";
import { UserInfo } from "../services/api/auth/auth.dto";

export const parseUserData = (data: Record<string, unknown>): UserInfo => {
  return {
    id: String(data.userId),
    username: String(data.username),
    email: String(data.email),
  };
};

export async function fetchMetadataIpfs(
  metadataIpfs: string
): Promise<MetadataIpfs> {
  const res = await axios.get(metadataIpfs);
  const { name, description, url } = Object(res.data);
  return {
    name,
    description,
    url,
  };
}
