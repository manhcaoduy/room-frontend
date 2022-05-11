export interface TransactionDto {
  blockHash: string | null;
  blockNumber: number | null;
  from: string;
  gas: number;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: number;
  transactionIndex: number | null;
}

export interface GetTxByTxHashRequest {
  txHash: string;
}

export interface GetTxByTxHashResponse {
  transaction: TransactionDto;
}
