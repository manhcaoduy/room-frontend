import Web3 from "web3";
import { ENVS } from "../../envs/config.develop";
import {
  GetTxByTxHashRequest,
  GetTxByTxHashResponse,
  TransactionDto,
} from "./blockchain.dto";

export default class BlockchainService {
  private static instance?: BlockchainService;
  private readonly _web3: Web3;

  constructor() {
    this._web3 = new Web3(ENVS.blockchainHttpEndpoint);
  }

  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private get web3(): Web3 {
    return this._web3;
  }

  public async getTxByTxHash({
    txHash,
  }: GetTxByTxHashRequest): Promise<GetTxByTxHashResponse> {
    const result = await this.web3.eth.getTransaction(txHash);
    const transaction: TransactionDto = {
      blockHash: result.blockHash,
      blockNumber: result.blockNumber,
      from: result.from,
      gas: result.gas,
      gasPrice: result.gasPrice,
      hash: result.hash,
      input: result.input,
      nonce: result.nonce,
      transactionIndex: result.transactionIndex,
    };
    return { transaction };
  }
}
