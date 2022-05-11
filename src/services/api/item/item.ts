import { http } from "../http/http";
import {
  ChangeOwnerItemRequest,
  ChangeOwnerItemResponse,
  ChangeSaleInfoRequest,
  CheckOwnershipRequest,
  CheckOwnershipResponse,
  CreateItemRequest,
  CreateItemResponse,
  GetItemsByIdsRequest,
  GetItemsByIdsResponse,
  GetItemsByWalletRequest,
  GetItemsByWalletResponse,
  GetItemsResponse,
  GetMarketplaceResponse,
  ItemDto,
  MintItemRequest,
  MintItemResponse,
} from "./item.dto";

export default class ItemService {
  private static instance?: ItemService;

  public static getInstance(): ItemService {
    if (!ItemService.instance) ItemService.instance = new ItemService();
    return ItemService.instance;
  }

  public async getItemsByIds({
    itemIds,
  }: GetItemsByIdsRequest): Promise<GetItemsByIdsResponse> {
    const res = await http.get("/items/ids", { itemIds: itemIds.join(",") });
    return Object(res.data);
  }

  public async createItem({
    metadataIpfs,
  }: CreateItemRequest): Promise<CreateItemResponse> {
    const res = await http.post("/items/create", {
      type: 0,
      metadataIpfs,
    });
    return Object(res.data);
  }

  public async getItems(): Promise<GetItemsResponse> {
    const res = await http.get("/items");
    return Object(res.data);
  }

  public async getMarketplace(): Promise<GetMarketplaceResponse> {
    const res = await http.get("/items/marketplace");
    return Object(res.data);
  }

  public async getItemsByWallet({
    walletAddress,
  }: GetItemsByWalletRequest): Promise<GetItemsByWalletResponse> {
    const res = await http.get("/items/wallet", { walletAddress });
    return Object(res.data);
  }

  public async checkOwnership({
    itemId,
  }: CheckOwnershipRequest): Promise<CheckOwnershipResponse> {
    const res = await http.post("/items/check-ownership", { itemId });
    return Object(res.data);
  }

  public async changeSaleInfo({
    itemId,
    isForSale,
    price,
    marketItemId,
  }: ChangeSaleInfoRequest): Promise<ItemDto> {
    const res = await http.post("/items/change-item-sale", {
      itemId,
      isForSale,
      price,
      marketItemId,
    });
    return Object(res.data);
  }

  public async mintItem({
    walletAddress,
    itemId,
    tokenId,
  }: MintItemRequest): Promise<MintItemResponse> {
    const res = await http.post("/items/mint", {
      walletAddress,
      itemId,
      tokenId,
    });
    return Object(res.data);
  }

  public async changeOwnerItem({
    walletAddress,
    itemId,
  }: ChangeOwnerItemRequest): Promise<ChangeOwnerItemResponse> {
    const res = await http.post("/items/change-owner", {
      walletAddress,
      itemId,
    });
    return Object(res.data);
  }
}
