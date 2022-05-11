import { http } from "../http/http";
import {
  CreateItemHistoryRequest,
  CreateItemHistoryResponse,
  GetItemHistoryRequest,
  GetItemHistoryResponse,
} from "./item-history.dto";

export default class ItemHistoryService {
  private static instance?: ItemHistoryService;

  public static getInstance(): ItemHistoryService {
    if (!ItemHistoryService.instance)
      ItemHistoryService.instance = new ItemHistoryService();
    return ItemHistoryService.instance;
  }

  public async getItemHistories({
    itemId,
  }: GetItemHistoryRequest): Promise<GetItemHistoryResponse> {
    const res = await http.post("/item-history/get", { itemId });
    return Object(res.data);
  }

  public async createItemHistory({
    itemId,
    actor,
    type,
  }: CreateItemHistoryRequest): Promise<CreateItemHistoryResponse> {
    const res = await http.post("/item-history/create", {
      itemId,
      actor,
      type,
    });
    return Object(res.data);
  }
}
