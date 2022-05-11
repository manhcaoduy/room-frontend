import { http } from "../http/http";
import {
  CreateActionRequest,
  CreateActionResponse,
  GetActionResponse,
} from "./action.dto";

export default class ActionService {
  private static instance?: ActionService;

  public static getInstance(): ActionService {
    if (!ActionService.instance) ActionService.instance = new ActionService();
    return ActionService.instance;
  }

  public async getActions(): Promise<GetActionResponse> {
    const res = await http.get("/action");
    return Object(res.data);
  }

  public async createAction({
    itemId,
    itemName,
    type,
    txHash,
  }: CreateActionRequest): Promise<CreateActionResponse> {
    const res = await http.post("/action/create", {
      itemId,
      itemName,
      type,
      txHash,
    });
    return Object(res.data);
  }
}
