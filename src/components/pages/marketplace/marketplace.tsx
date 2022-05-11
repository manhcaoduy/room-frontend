import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import ItemCard from "../../utils/item-card/item-card";
import AuthService from "../../../services/api/auth/auth";
import { useNavigate } from "react-router-dom";
import ItemService from "../../../services/api/item/item";
import { ItemDto } from "../../../services/api/item/item.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import MarketplaceLogo from "../../../resources/images/marketplace.jpg";

export default function Marketplace(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [marketplace, setMarketplace] = useState<ItemDto[]>([]);

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
          .getMarketplace()
          .then((resp) => {
            const { items } = resp;
            setMarketplace(items);
            setLoading(false);
          });
      });
  }, []);

  return (
    <>
      <Nav screen={2} username={userInfo ? userInfo.username : ""} />
      {!loading && (
        <>
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="bg-contain"
              style={{
                width: "1568px",
                height: "420px",
                backgroundImage: `url(${MarketplaceLogo})`,
              }}
            />
          </div>
          <section className="text-gray-600 body-font">
            <div className="container px-2 py-10 mx-auto">
              <div className="flex flex-wrap -m-4">
                {marketplace.map((item, index) => {
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
