import React, { useEffect, useState } from "react";
import Loading from "../loading/loading";
import { fetchMetadataIpfs } from "../../../helpers/data.helpers";
import { IItemCard } from "./item-card.interface";
import ItemService from "../../../services/api/item/item";
import ItemFavoriteService from "../../../services/api/item-favorite/item-favorite";
import { ReactComponent as HeartLogo } from "../../../resources/images/heart.svg";

export default function ItemCard(props: IItemCard): JSX.Element {
  const { id, metadataIpfs, handleFavoriteButton } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isForSale, setIsForSale] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    ItemService.getInstance()
      .getItemsByIds({ itemIds: [id] })
      .then((resp) => {
        const { items } = resp;
        const { isForSale, price } = items[0];
        setIsForSale(isForSale);
        setPrice(price);
        ItemFavoriteService.getInstance()
          .checkFavorite({ itemId: id })
          .then((resp) => {
            const { isFavorite } = resp;
            setIsFavorite(isFavorite);
          });
        fetchMetadataIpfs(metadataIpfs).then((metadata) => {
          const { name, url } = metadata;
          setName(name);
          setUrl(url);
          setLoading(false);
        });
      });
  }, []);

  return (
    <>
      <div className="xl:w-1/4 md:w-1/3 py-6 px-2 w-full overflow-hidden transform duration-500 ease-in-out hover:scale-105">
        <div>
          {loading && <Loading />}
          {!loading && (
            <>
              <div className="bg-gray-900 text-white shadow-gray-500 shadow-md rounded-md">
                <a href={`/item/${id}`}>
                  <div className="block relative h-80 rounded overflow-hidden">
                    <img
                      alt="ecommerce"
                      className="object-cover w-full h-full block"
                      src={url}
                    />
                  </div>
                </a>
                <div className="px-4 pt-8">
                  <div className="border-b border-gray-400 pb-4 flex justify-between">
                    <div className="text-xl font-medium font-menlo">{name}</div>
                    <button
                      type="button"
                      onClick={(): void => {
                        const favorite = isFavorite;
                        if (favorite) {
                          ItemFavoriteService.getInstance().removeFavorite({
                            itemId: id,
                          });
                        } else {
                          ItemFavoriteService.getInstance().createFavorite({
                            itemId: id,
                          });
                        }
                        if (handleFavoriteButton) {
                          handleFavoriteButton(!favorite, id);
                        }
                        setIsFavorite(!isFavorite);
                      }}
                    >
                      {isFavorite ? (
                        <HeartLogo fill="red" className="w-6 h-6" />
                      ) : (
                        <HeartLogo fill="white" className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <div className="py-4">
                    {isForSale ? (
                      <>
                        <div className="text-sm font-menlo">Price</div>
                        <div className="grow">
                          <div className="flex flex-row font-semibold text-md w-full">
                            {price} ETH
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-md font-menlo">Not sale</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
