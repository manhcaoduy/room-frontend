import { WalletTypeEnum } from "../../resources/constants/enum";

export interface WalletDto {
  address: string;
  type: WalletTypeEnum;
}
