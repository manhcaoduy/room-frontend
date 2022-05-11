export enum ActionType {
  CREATE = 0,
  MINT = 1,
  SELL = 2,
  BUY = 3,
}

export interface UserAction {
  userId: string;
  itemId: string;
  itemName: string;
  type: ActionType;
  txHash: string;
}

export interface GetActionResponse {
  actions: UserAction[];
}

export interface CreateActionRequest {
  itemId: string;
  itemName: string;
  type: ActionType;
  txHash: string;
}

export interface CreateActionResponse {
  action: UserAction;
}
