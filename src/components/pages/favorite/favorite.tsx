import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import ItemCard from "../../utils/item-card/item-card";
import Loading from "../../utils/loading/loading";
import ItemFavoriteService from "../../../services/api/item-favorite/item-favorite";
import ItemService from "../../../services/api/item/item";
import { ItemDto } from "../../../services/api/item/item.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";

export default function Favorite(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [items, setItems] = useState<ItemDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        setUserInfo(profile);
        ItemFavoriteService.getInstance()
          .getFavorite()
          .then((resp) => {
            const { items } = resp;
            const itemIds = items.map((item) => item.itemId);
            ItemService.getInstance()
              .getItemsByIds({ itemIds })
              .then((resp) => {
                const { items } = resp;
                setItems(items);
                setLoading(false);
              });
          });
      });
  }, []);

  function handleFavoriteButton(isFavorite: boolean, itemId: string): void {
    if (!isFavorite) {
      const newItems = items.filter((item) => item.id !== itemId);
      setItems(newItems);
    }
  }

  return (
    <>
      <Nav screen={1} username={userInfo ? userInfo.username : ""} />
      {loading && (
        <>
          <div className="w-full p-20 flex justify-center items-center">
            <Loading />
          </div>
        </>
      )}
      {!loading && (
        <>
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-10 mx-auto">
              <div className="flex flex-wrap -m-4">
                {items.map((item, index) => {
                  return (
                    <ItemCard
                      id={item.id}
                      metadataIpfs={item.metadataIpfs}
                      key={`item-card-${index}`}
                      handleFavoriteButton={handleFavoriteButton}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
