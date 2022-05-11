export enum HistoryType {
  CREATE = 0,
  MINT = 1,
  ENABLE = 2,
  CANCELED = 3,
  BUY = 4,
}

export interface ItemHistory {
  itemId: string;
  actor: string;
  type: HistoryType;
}

export interface GetItemHistoryRequest {
  itemId: string;
}

export interface GetItemHistoryResponse {
  itemHistories: ItemHistory[];
}

export interface CreateItemHistoryRequest {
  itemId: string;
  actor: string;
  type: HistoryType;
}

export interface CreateItemHistoryResponse {
  itemHistory: ItemHistory;
}
