import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Loading from "../../utils/loading/loading";
import ItemService from "../../../services/api/item/item";
import ItemFavoriteService from "../../../services/api/item-favorite/item-favorite";
import { trimLongDescription } from "../../../helpers/utils";
import { fetchMetadataIpfs } from "../../../helpers/data.helpers";
import { ItemType } from "../../../services/api/item/item.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import MetamaskWalletService from "../../../services/wallet/metamask";
import ActionService from "../../../services/api/action/action";
import { ActionType } from "../../../services/api/action/action.dto";
import EthSvg from "../../../resources/svg/eth.svg";
import Popup from "../../utils/popup/popup";
import {
  BuyItemResponse,
  CancelItemResponse,
  EnableSellingItemResponse,
  UploadItemResponse,
} from "../../../services/wallet/metamask.dto";
import ItemHistoryService from "../../../services/api/item-history/item-history";
import {
  HistoryType,
  ItemHistory,
} from "../../../services/api/item-history/item-history.dto";

export default function Item(): JSX.Element {
  const { id } = useParams();
  const itemId = id ? id : "";

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);

  const [url, setUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [itemType, setItemType] = useState<ItemType>(ItemType.USER);
  const [isOwned, setIsOwned] = useState<boolean>(false);
  const [ownedWalletAddress, setOwnedWalletAddress] = useState<string>();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isForSale, setIsForSale] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(0);
  const [tokenId, setTokenId] = useState<number>(-1);
  const [marketItemId, setMarketItemId] = useState<number>(-1);
  const [itemHistory, setItemHistory] = useState<ItemHistory[]>([]);

  const [isDetail, setIsDetail] = useState<boolean>(true);
  const [metadataIpfs, setMetadataIpfs] = useState<string>("");

  const [isPopup, setIsPopup] = useState<boolean>(false);

  async function initData(): Promise<void> {
    const profile = await AuthService.getInstance().getProfile();
    if (!profile) {
      navigate("/login");
      return;
    }
    setUserInfo(profile);

    const { items } = await ItemService.getInstance().getItemsByIds({
      itemIds: [itemId],
    });
    const item = items[0];
    const { isForSale, price, owner, type, tokenId, marketItemId } = item;
    setItemType(type);
    if (type === ItemType.WALLET) {
      setOwnedWalletAddress(owner);
    }
    setIsForSale(isForSale);
    setPrice(price);
    setTokenId(tokenId);
    setMarketItemId(marketItemId);

    const { owned } = await ItemService.getInstance().checkOwnership({
      itemId,
    });
    setIsOwned(owned);

    const { isFavorite } =
      await ItemFavoriteService.getInstance().checkFavorite({ itemId });
    setIsFavorite(isFavorite);

    setMetadataIpfs(item.metadataIpfs);

    const { name, description, url } = await fetchMetadataIpfs(
      item.metadataIpfs
    );
    setUrl(url);
    setName(name);
    setDescription(description);

    const { itemHistories } =
      await ItemHistoryService.getInstance().getItemHistories({ itemId });
    setItemHistory(itemHistories);

    setLoading(false);
  }

  useEffect(() => {
    if (itemId === "") {
      navigate("/collections");
      return;
    }
    initData();
  }, []);

  async function updateMintToDB({
    txHash,
    tokenId,
    owner,
  }: UploadItemResponse): Promise<void> {
    await ItemService.getInstance().mintItem({
      itemId,
      tokenId,
      walletAddress: owner,
    });
    await ActionService.getInstance().createAction({
      itemId,
      txHash,
      itemName: name,
      type: ActionType.MINT,
    });
    await ItemHistoryService.getInstance().createItemHistory({
      itemId,
      actor: owner,
      type: HistoryType.MINT,
    });
  }

  function handleMint(): void {
    MetamaskWalletService.getInstance()
      .uploadItem({ metadataIpfs })
      .then((resp) => {
        updateMintToDB(resp).then(() => {
          window.location.reload();
        });
      });
  }

  async function updateEnableToDB({
    price,
    marketItemId,
    walletAddress,
  }: EnableSellingItemResponse): Promise<void> {
    await ItemService.getInstance().changeSaleInfo({
      itemId,
      isForSale: true,
      price,
      marketItemId,
    });
    await ItemHistoryService.getInstance().createItemHistory({
      itemId,
      actor: walletAddress,
      type: HistoryType.ENABLE,
    });
  }

  async function handleEnable(price: number): Promise<void> {
    const resp = await MetamaskWalletService.getInstance().enableSellingItem({
      price,
      tokenId,
    });
    await updateEnableToDB(resp).then(() => {
      window.location.reload();
    });
  }

  async function updateCancelToDB({
    walletAddress,
  }: CancelItemResponse): Promise<void> {
    await ItemService.getInstance().changeSaleInfo({
      itemId,
      isForSale: false,
      price: -1,
      marketItemId: -1,
    });
    await ItemHistoryService.getInstance().createItemHistory({
      itemId,
      actor: walletAddress,
      type: HistoryType.CANCELED,
    });
  }

  function handleCancel(): void {
    MetamaskWalletService.getInstance()
      .cancelSellingItem({ marketItemId })
      .then((resp) => {
        updateCancelToDB(resp).then(() => {
          window.location.reload();
        });
      });
  }

  async function updateBuyToDB({
    txHash,
    buyer,
  }: BuyItemResponse): Promise<void> {
    await ItemService.getInstance().changeOwnerItem({
      itemId,
      walletAddress: buyer,
    });
    await ActionService.getInstance().createAction({
      itemId,
      txHash,
      itemName: name,
      type: ActionType.BUY,
    });
    await ItemHistoryService.getInstance().createItemHistory({
      itemId,
      actor: buyer,
      type: HistoryType.BUY,
    });
  }

  function handleBuy(): void {
    MetamaskWalletService.getInstance()
      .buyItem({ price, marketItemId })
      .then((resp) => {
        updateBuyToDB(resp).then(() => {
          window.location.reload();
        });
      });
  }

  function handleClickFavorite(): void {
    if (isFavorite) {
      ItemFavoriteService.getInstance().removeFavorite({ itemId });
    } else {
      ItemFavoriteService.getInstance().createFavorite({ itemId });
    }
    setIsFavorite(!isFavorite);
  }

  return (
    <>
      <Nav screen={-1} username={userInfo ? userInfo.username : ""} />
      {loading && (
        <div className="w-full p-20 flex justify-center items-center">
          <Loading />
        </div>
      )}
      {!loading && (
        <>
          <div className="bg-gray-200 min-h-screen min-w-screen">
            <div className="w-full p-4">
              <img
                src={url}
                style={{ minWidth: "36rem", minHeight: "36rem" }}
                className="m-auto max-w-2xl max-h-2xl object-contain"
              />
            </div>
            <div className="w-full bg-gray-50">
              <div className="w-2/3 m-auto max-w-screen-2xl px-6 pb-2 pt-0 grow flex flex-col rounded-3xl">
                <div className="py-10 relative">
                  <div className="items-center flex flex-row justify-center m-auto">
                    <div className="flex flex-col grow">
                      <div className="flex">
                        <div className="text-4xl leading-5 font-bold ">
                          {name}
                        </div>
                      </div>
                    </div>
                  </div>
                  {ownedWalletAddress && (
                    <div className="mt-6">
                      <div className="flex flex-row items-center">
                        <div className="mr-2 font-menlo text-md">Owned by</div>
                        <a
                          className="transition cursor-pointer outline-offset-2 outline-offset-2 text-inherit text-sm
                      font-semibold ml-1 no-underline hover:underline hover:text-red-500"
                          href={`/collections/${ownedWalletAddress}`}
                        >
                          {trimLongDescription(ownedWalletAddress, 10)}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="absolute right-0 top-0 flex -translate-y-2/4">
                    <div className="mr-2"></div>
                    <div className="mr-2">
                      <div>
                        <button
                          className="relative flex items-center leading-4 rounded-b-2xl p-4 bg-white shadow-xl transition hover:scale-110"
                          onClick={handleClickFavorite}
                        >
                          <div className="absolute -z-10 left-0 top-0 w-full h-full opacity-0 rounded-2xl transition"></div>
                          <div
                            className={
                              "opacity-70" + (isFavorite ? "" : " grayscale")
                            }
                          >
                            ❤️
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 grid-cols-12 pb-8">
                  <div className="col-span-4">
                    <div className="p-4 rounded-xl bg-white shadow-lg shadow-gray-500">
                      <div className="relative">
                        {isOwned ? (
                          itemType === ItemType.USER ? (
                            <>
                              <div className="mb-3 flex items-center">
                                <div className="flex items-center grow">
                                  <div className="font-bold w-full text-center">
                                    This item isn&#39;t minted
                                  </div>
                                </div>
                              </div>
                              <button
                                className="inline-flex appearance-none items-center justify-center select-none whitespace-nowrap
                        align-middle outline-offset-2 outline-2 w-full leading-5 rounded-xl font-semibold transition
                        h-12 min-w-12 text-lg px-6 bg-blue-500 text-white hover:bg-blue-700"
                                onClick={(): void => {
                                  handleMint();
                                }}
                              >
                                Mint Item
                              </button>
                            </>
                          ) : isForSale ? (
                            <>
                              <div className="mb-3 flex items-center">
                                <div className="flex items-center grow">
                                  <div className="flex flex-row justify-center items-center font-bold w-full text-center">
                                    <span className="text-lg">{price}</span>
                                    <img
                                      className="w-5 h-5 inline-block"
                                      src={EthSvg}
                                    />
                                  </div>
                                </div>
                              </div>
                              <button
                                className="inline-flex appearance-none items-center justify-center select-none whitespace-nowrap
                        align-middle outline-offset-2 outline-2 w-full leading-5 rounded-xl font-semibold transition
                        h-12 min-w-12 text-lg px-6 bg-red-500 text-white hover:bg-red-700"
                                onClick={(): void => {
                                  handleCancel();
                                }}
                              >
                                Disable sale item
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mb-3 flex items-center">
                                <div className="flex items-center grow">
                                  <div className="font-bold w-full text-center">
                                    This item isn&#39;t for sale
                                  </div>
                                </div>
                              </div>
                              <button
                                className="inline-flex appearance-none items-center justify-center select-none whitespace-nowrap
                        align-middle outline-offset-2 outline-2 w-full leading-5 rounded-xl font-semibold transition
                        h-12 min-w-12 text-lg px-6 bg-green-500 text-white hover:bg-green-700"
                                onClick={(): void => {
                                  // handleEnable();
                                  setIsPopup(true);
                                }}
                              >
                                Sell this Item
                              </button>
                            </>
                          )
                        ) : isForSale ? (
                          <>
                            <div className="mb-3 flex items-center">
                              <div className="flex items-center grow">
                                <div className="flex flex-row justify-center items-center font-bold w-full text-center">
                                  <span className="text-lg">{price}</span>
                                  <img
                                    className="w-5 h-5 inline-block"
                                    src={EthSvg}
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              className="inline-flex appearance-none items-center justify-center select-none whitespace-nowrap
                        align-middle outline-offset-2 outline-2 w-full leading-5 rounded-xl font-semibold transition
                        h-12 min-w-12 text-lg px-6 bg-red-500 text-white hover:bg-red-700"
                              onClick={(): void => handleBuy()}
                            >
                              Buy Item
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mb-3 flex items-center">
                              <div className="flex items-center grow">
                                <div className="font-bold w-full text-center">
                                  This item is not for sale
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-8">
                    <div className="p-4 rounded-xl bg-white shadow-md shadow-gray-400 font-menlo">
                      <div className="block">
                        <div
                          className="flex justify-items-start flex-row border-b-2 border-solid gap-x-4
                        border-gray-200 overflow-x-auto overflow-y-hidden"
                        >
                          <button
                            className={
                              isDetail ? "font-bold text-blue-400" : ""
                            }
                            onClick={(): void => setIsDetail(!isDetail)}
                          >
                            Details
                          </button>
                          <button
                            className={
                              isDetail ? "" : "font-bold text-blue-400"
                            }
                            onClick={(): void => setIsDetail(!isDetail)}
                          >
                            History
                          </button>
                        </div>
                        <div className="pt-4 break-words">
                          {isDetail && (
                            <>
                              <div className="flex flex-col gap-y-4">
                                <div>{description}</div>
                                {tokenId != -1 && (
                                  <div>
                                    <span className="font-semibold font-menlo">
                                      TokenId:{" "}
                                    </span>
                                    {tokenId}
                                  </div>
                                )}
                                {marketItemId != -1 && (
                                  <div>
                                    <span className="font-semibold font-menlo">
                                      MarketItemId:{" "}
                                    </span>
                                    {marketItemId}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                          {!isDetail && (
                            <>
                              <div className="w-full flex">
                                <div className="w-1/3 text-center font-menlo font-semibold border bg-gray-100 py-4">
                                  Type
                                </div>
                                <div className="w-2/3 text-center font-menlo font-semibold border bg-gray-100 py-4">
                                  Actor
                                </div>
                              </div>
                              {itemHistory.map((history) => {
                                const { type, actor } = history;
                                return (
                                  <>
                                    <div className="w-full flex hover:bg-gray-100">
                                      <div className="w-1/3 text-center font-menlo font-semibold border flex items-center justify-center">
                                        {type === HistoryType.CREATE && (
                                          <>
                                            <div className="rounded-3xl p-1 w-1/2 py-4">
                                              Create
                                            </div>
                                          </>
                                        )}
                                        {type === HistoryType.MINT && (
                                          <>
                                            <div className="rounded-3xl p-1 w-1/2 text-yellow-600 py-4">
                                              Mint
                                            </div>
                                          </>
                                        )}
                                        {type === HistoryType.ENABLE && (
                                          <>
                                            <div className="rounded-3xl p-1 w-1/2 text-green-600 py-4">
                                              Enable
                                            </div>
                                          </>
                                        )}
                                        {type === HistoryType.CANCELED && (
                                          <>
                                            <div className="rounded-3xl p-1 w-1/2 text-red-600 py-4">
                                              Canceled
                                            </div>
                                          </>
                                        )}
                                        {type === HistoryType.BUY && (
                                          <>
                                            <div className="rounded-3xl p-1 w-1/2 text-blue-600 py-4">
                                              Buy
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      {type === HistoryType.CREATE ? (
                                        <div className="w-2/3 text-center font-menlo font-semibold border py-4">
                                          {actor}
                                        </div>
                                      ) : (
                                        <>
                                          <div className="w-2/3 text-center font-menlo font-semibold border text-center hover:text-red-600 py-4">
                                            <a href={`/collections/${actor}`}>
                                              {trimLongDescription(actor, 10)}
                                            </a>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Popup
            isOpen={isPopup}
            setIsOpen={setIsPopup}
            handleEnable={handleEnable}
          />
        </>
      )}
    </>
  );
}
