import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Loading from "../../utils/loading/loading";
import ItemService from "../../../services/api/item/item";
import ItemCard from "../../utils/item-card/item-card";
import { ItemDto } from "../../../services/api/item/item.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";

export default function Collections(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userItems, setUserItems] = useState<ItemDto[]>([]);

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        setUserInfo(profile);
        ItemService.getInstance()
          .getItems()
          .then((resp) => {
            const { items } = resp;
            setUserItems(items);
            setLoading(false);
          });
      });
  }, []);

  return (
    <>
      <Nav screen={0} username={userInfo ? userInfo.username : ""} />
      {loading && (
        <>
          <div className="w-full p-20 flex justify-center items-center absolute m-auto bg-transparent">
            <Loading />
          </div>
        </>
      )}
      {!loading && (
        <>
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-10 mx-auto">
              <div className="flex flex-wrap -m-4">
                {userItems.map((item, index) => {
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
