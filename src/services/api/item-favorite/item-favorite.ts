import { http } from "../http/http";
import {
  CheckFavoriteRequest,
  CheckFavoriteResponse,
  CreateFavoriteRequest,
  CreateFavoriteResponse,
  GetFavoriteResponse,
  RemoveFavoriteRequest,
  RemoveFavoriteResponse,
} from "./item-favorite.dto";

export default class ItemFavoriteService {
  private static instance?: ItemFavoriteService;

  public static getInstance(): ItemFavoriteService {
    if (!ItemFavoriteService.instance)
      ItemFavoriteService.instance = new ItemFavoriteService();
    return ItemFavoriteService.instance;
  }

  public async getFavorite(): Promise<GetFavoriteResponse> {
    const res = await http.get("/item-favorite");
    return Object(res.data);
  }

  public async createFavorite({
    itemId,
  }: CreateFavoriteRequest): Promise<CreateFavoriteResponse> {
    const res = await http.post("/item-favorite/create", { itemId });
    return Object(res.data);
  }

  public async removeFavorite({
    itemId,
  }: RemoveFavoriteRequest): Promise<RemoveFavoriteResponse> {
    const res = await http.post("/item-favorite/remove", { itemId });
    return Object(res.data);
  }

  public async checkFavorite({
    itemId,
  }: CheckFavoriteRequest): Promise<CheckFavoriteResponse> {
    const res = await http.post("/item-favorite/check", { itemId });
    return Object(res.data);
  }
}
