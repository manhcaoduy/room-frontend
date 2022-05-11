import React, { useEffect, useState } from "react";
import Canvas from "../../utils/room/three/canvas";
import SEO from "../../utils/room/main/seo/seo";
import Loading from "../../utils/loading/loading";
import AuthService from "../../../services/api/auth/auth";
import ItemService from "../../../services/api/item/item";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import { ItemDto } from "../../../services/api/item/item.dto";
import { useNavigate } from "react-router-dom";
import { fetchMetadataIpfs } from "../../../helpers/data.helpers";

export default function Room(): JSX.Element {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [itemUrls, setItemUrls] = useState<string[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init(): Promise<void> {
    const profile = await AuthService.getInstance().getProfile();
    if (!profile) {
      navigate("/login");
      return;
    }
    setUserInfo(profile);

    const { items } = await ItemService.getInstance().getItems();

    const itemUrls: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const { metadataIpfs } = item;
      const { url } = await fetchMetadataIpfs(metadataIpfs);
      itemUrls.push(url);
    }
    setItemUrls(itemUrls);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && (
        <div className="w-full p-20 flex justify-center items-center absolute m-auto bg-transparent">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div id="scene-container" style={{ height: "100vh", width: "100%" }}>
          <Canvas itemUrls={itemUrls} />
        </div>
      )}
    </>
  );
}
