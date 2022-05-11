import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Nav from "../../utils/nav/nav";
import Loading from "../../utils/loading/loading";
import ItemCard from "../../utils/item-card/item-card";
import ItemService from "../../../services/api/item/item";
import { ItemDto } from "../../../services/api/item/item.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";

export default function ItemWallet(): JSX.Element {
  const { id } = useParams();

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [walletItems, setWalletItems] = useState<ItemDto[]>([]);

  useEffect(() => {
    if (!id) {
      navigate("/collections");
      return;
    }

    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        setUserInfo(profile);
        ItemService.getInstance()
          .getItemsByWallet({ walletAddress: id })
          .then((resp) => {
            const { items } = resp;
            setWalletItems(items);
            setLoading(false);
          });
      });
  }, []);

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
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-10 mx-auto">
              <div className="flex flex-wrap -m-4">
                {walletItems.map((item, index) => {
                  return (
                    <ItemCard
                      id={item.id}
                      metadataIpfs={item.metadataIpfs}
                      key={`item-card-${index}`}
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
