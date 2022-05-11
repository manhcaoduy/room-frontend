export interface FavoriteItem {
  userId: string;
  itemId: string;
}

export interface GetFavoriteResponse {
  items: FavoriteItem[];
}

export interface CreateFavoriteRequest {
  itemId: string;
}

export interface CreateFavoriteResponse {
  item: FavoriteItem;
}

export interface RemoveFavoriteRequest {
  itemId: string;
}

export interface RemoveFavoriteResponse {
  result: boolean;
}

export interface CheckFavoriteRequest {
  itemId: string;
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
}
