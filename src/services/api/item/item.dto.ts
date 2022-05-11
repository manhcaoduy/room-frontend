export enum ItemType {
  USER = 0,
  WALLET = 1,
}

export interface ItemDto {
  id: string;
  type: ItemType;
  owner: string;
  metadataIpfs: string;
  isForSale: boolean;
  price: number;
  tokenId: number;
  marketItemId: number;
}

export interface GetItemsByIdsRequest {
  itemIds: string[];
}

export interface GetItemsByIdsResponse {
  items: ItemDto[];
}

export interface CreateItemRequest {
  metadataIpfs: string;
}

export interface CreateItemResponse {
  item: ItemDto;
}

export interface GetItemsResponse {
  items: ItemDto[];
}

export interface GetMarketplaceResponse {
  items: ItemDto[];
}

export interface GetItemsByWalletRequest {
  walletAddress: string;
}

export interface GetItemsByWalletResponse {
  items: ItemDto[];
}

export interface CheckOwnershipRequest {
  itemId: string;
}

export interface CheckOwnershipResponse {
  owned: boolean;
}

export interface ChangeSaleInfoRequest {
  itemId: string;
  isForSale: boolean;
  price: number;
  marketItemId?: number;
}

export interface ChangeSaleInfoResponse {
  item: ItemDto;
}

export interface MintItemRequest {
  walletAddress: string;
  itemId: string;
  tokenId: number;
}

export interface MintItemResponse {
  item: ItemDto;
}

export interface ChangeOwnerItemRequest {
  walletAddress: string;
  itemId: string;
}

export interface ChangeOwnerItemResponse {
  item: ItemDto;
}
