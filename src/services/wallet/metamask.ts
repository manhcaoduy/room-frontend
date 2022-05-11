import Web3 from "web3";
import NFTContract from "../../resources/abi/NFT.json";
import MarketContract from "../../resources/abi/Market.json";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import UserWalletService from "../api/user-wallet/user-wallet";
import { WalletTypeEnum } from "../../resources/constants/enum";
import { WalletDto } from "./wallet.dto";
import {
  BuyItemRequest,
  BuyItemResponse,
  CancelItemRequest,
  CancelItemResponse,
  DisconnectWalletRequest,
  DisconnectWalletResponse,
  EnableSellingItemRequest,
  EnableSellingItemResponse,
  LinkWalletResponse,
  UploadItemRequest,
  UploadItemResponse,
} from "./metamask.dto";
import { MarketContractAddress, NFTContractAddress } from "./metamask.constant";

export default class MetamaskWalletService {
  private static instance?: MetamaskWalletService;
  private readonly _web3: Web3;
  private _address?: string;

  constructor() {
    this._web3 = new Web3(Object(window).ethereum);
    this.slientConnect().then(() => {
      Object(window).ethereum.on("accountsChanged", this.handleAccountChanged);
    });
  }

  public static getInstance(): MetamaskWalletService {
    if (!MetamaskWalletService.instance) {
      MetamaskWalletService.instance = new MetamaskWalletService();
    }
    return MetamaskWalletService.instance;
  }

  public async linkWallet(): Promise<LinkWalletResponse> {
    const { address } = await this.getAccount();

    const { message: nonce } =
      await UserWalletService.getInstance().generateNonceMessage({
        walletAddress: address,
        network: WalletTypeEnum.EVM,
      });

    const signature = await this.web3.eth.personal.sign(
      Web3.utils.fromUtf8(nonce),
      address,
      ""
    );

    const { userWallet } = await UserWalletService.getInstance().connect({
      walletAddress: address,
      network: WalletTypeEnum.EVM,
      signature,
    });

    return { userWallet };
  }

  public async disconnectAddress({
    walletAddress,
  }: DisconnectWalletRequest): Promise<DisconnectWalletResponse> {
    try {
      const { result } = await UserWalletService.getInstance().disconnect({
        walletAddress,
        network: WalletTypeEnum.EVM,
      });
      return { result };
    } catch (e) {
      return {
        result: false,
      };
    }
  }

  public async uploadItem({
    metadataIpfs,
  }: UploadItemRequest): Promise<UploadItemResponse> {
    const { address } = await this.getAccount();
    const contract = this.createContract(
      NFTContract.abi as AbiItem[],
      NFTContractAddress
    );
    const resp = await contract.methods.mint(metadataIpfs).send({
      from: address,
    });
    const txHash = resp.transactionHash;
    const { tokenId: tokenIdStr, to: owner } =
      resp.events.Transfer.returnValues;
    return {
      txHash,
      tokenId: Number(tokenIdStr),
      owner,
    };
  }

  public async enableSellingItem({
    price,
    tokenId,
  }: EnableSellingItemRequest): Promise<EnableSellingItemResponse> {
    const { address } = await this.getAccount();

    const moveNFTContract = this.createContract(
      NFTContract.abi as AbiItem[],
      NFTContractAddress
    );
    await moveNFTContract.methods
      .setApprovalForAll(MarketContractAddress, true)
      .send({
        from: address,
      });

    const contract = this.createContract(
      MarketContract.abi as AbiItem[],
      MarketContractAddress
    );
    const web3 = new Web3();
    const value = web3.utils.toWei(price.toString(), "ether");
    const resp = await contract.methods
      .createMarketItem(NFTContractAddress, tokenId, value)
      .send({
        from: address,
      });

    const { itemId: marketItemIdStr } =
      resp.events.MarketItemCreated.returnValues;
    const walletAddress = resp.from;

    return {
      price,
      marketItemId: Number(marketItemIdStr),
      walletAddress,
    };
  }

  public async cancelSellingItem({
    marketItemId,
  }: CancelItemRequest): Promise<CancelItemResponse> {
    const { address } = await this.getAccount();

    const contract = this.createContract(
      MarketContract.abi as AbiItem[],
      MarketContractAddress
    );
    const resp = await contract.methods
      .cancelMarketItem(NFTContractAddress, marketItemId)
      .send({
        from: address,
      });

    const walletAddress = resp.from;

    return {
      walletAddress,
    };
  }

  public async buyItem({
    marketItemId,
    price,
  }: BuyItemRequest): Promise<BuyItemResponse> {
    const { address } = await this.getAccount();

    const contract = this.createContract(
      MarketContract.abi as AbiItem[],
      MarketContractAddress
    );

    const web3 = new Web3();
    const value = web3.utils.toWei(price.toString(), "ether");
    const resp = await contract.methods
      .createMarketSale(NFTContractAddress, marketItemId)
      .send({
        from: address,
        value: value,
      });

    const txHash = resp.transactionHash;
    const { buyer, seller } = resp.events.MarketItemSold.returnValues;

    return {
      txHash,
      price,
      buyer,
      seller,
    };
  }

  private get web3(): Web3 {
    return this._web3;
  }

  private async slientConnect(): Promise<WalletDto | null> {
    try {
      const addresses = await this.web3.eth.getAccounts();
      this._address = addresses[0];
      return {
        address: addresses[0],
        type: WalletTypeEnum.EVM,
      };
    } catch (e) {
      return null;
    }
  }

  private handleAccountChanged(accounts: string[]): void {
    this._address = accounts[0];
  }

  private async getAccount(): Promise<WalletDto> {
    if (this._address) {
      return {
        address: this._address,
        type: WalletTypeEnum.EVM,
      };
    }
    const info = await this.getSelectedAccount();
    return info;
  }

  private async getSelectedAccount(): Promise<WalletDto> {
    const ethereum = Object(window).ethereum;
    const addresses = await ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    return {
      address: addresses[0],
      type: WalletTypeEnum.EVM,
    };
  }

  private createContract(abi: AbiItem[], contractAddress: string): Contract {
    return new this.web3.eth.Contract(abi as AbiItem[], contractAddress);
  }
}
