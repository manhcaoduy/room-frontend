export interface MetadataIpfs {
  url: string;
  name: string;
  description: string;
}

export interface IItemCard {
  id: string;
  metadataIpfs: string;
  handleFavoriteButton?: (isFavorite: boolean, itemId: string) => void;
}
