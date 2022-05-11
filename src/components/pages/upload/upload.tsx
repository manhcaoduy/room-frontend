import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import IpfsService from "../../../services/ipfs/ipfs";
import ItemService from "../../../services/api/item/item";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import ActionService from "../../../services/api/action/action";
import { ActionType } from "../../../services/api/action/action.dto";
import ItemHistoryService from "../../../services/api/item-history/item-history";
import { HistoryType } from "../../../services/api/item-history/item-history.dto";

export default function Upload(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [fileUploadDescription, setFileUploadDescription] = useState<string>(
    "We support image file."
  );

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        setUserInfo(profile);
      });
  }, []);

  function onFormSubmit(e: any): void {
    e.preventDefault();
    if (!file) {
      return;
    }
    IpfsService.getInstance()
      .process({
        name,
        description,
        file,
      })
      .then((ipfs) => {
        const url = `https://ipfs.infura.io/ipfs/${ipfs}`;
        ItemService.getInstance()
          .createItem({
            metadataIpfs: url,
          })
          .then((resp) => {
            const { item } = resp;
            const { id } = item;
            ActionService.getInstance()
              .createAction({
                itemId: id,
                itemName: name,
                type: ActionType.CREATE,
                txHash: "",
              })
              .then(() => {
                ItemHistoryService.getInstance()
                  .createItemHistory({
                    itemId: id,
                    actor: userInfo?.username || "",
                    type: HistoryType.CREATE,
                  })
                  .then(() => {
                    navigate(`/item/${id}`);
                  });
              });
          });
      });
  }

  function onFileChange(e: any): void {
    const file = e.target.files[0];
    setFileUploadDescription(file.name);
    setFile(file);
  }

  return (
    <>
      <Nav screen={3} username={userInfo ? userInfo.username : ""} />
      <form onSubmit={onFormSubmit}>
        <div className="flex flex-col items-center">
          <div className="w-2/3 md:w-1/3 pb-10">
            <div className="mt-6 mb-10 text-center">
              <div className="text-2xl leading-5 font-bold">
                {" "}
                Create a single NFT
              </div>
            </div>
            <div>
              <div className="m-4">
                <div className="mb-2">
                  <label
                    htmlFor="file"
                    className="font-semibold text-sm font-menlo"
                  >
                    Upload file
                  </label>
                </div>
                <div className="w-full p-10 flex border-2 border-dashed border-gray-500 rounded-3xl cursor-pointer">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <div className="flex-grow flex flex-col items-center justify-center w-full">
                    <div className="font-menlo text-sm">
                      {fileUploadDescription}
                    </div>
                    <button
                      type="button"
                      className="inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap
                      align-middle outline-offset-2 w-auto leading-5 font-semibold h-10 text-md p-4 bg-gray-100 hover:bg-gray-300 mt-10 rounded-3xl"
                      onClick={(): void => {
                        document.getElementById("file")?.click();
                      }}
                    >
                      Choose file
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-0">
                <div className="mb-1">
                  <label
                    htmlFor="name"
                    className="font-semibold font-menlo text-sm"
                  >
                    Name
                  </label>
                </div>
                <input
                  id="name"
                  className="w-full min-w-0 outline-offset-2 relative appearance-none transition text-md p-4
                  h-10 rounded-md border-2 border-solid bg-inherit border-inherit hover:border-gray-300 font-mentlo"
                  required={true}
                  onChange={(e): void => setName(e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1">
                  <label
                    htmlFor="description"
                    className="font-semibold font-menlo text-sm"
                  >
                    Description (Optional)
                  </label>
                </div>
                <textarea
                  id="description"
                  className="w-full min-w-0 outline-offset-2 relative appearance-none transition text-md p-4
                  h-40 rounded-md border-2 border-solid bg-inherit border-inherit hover:border-gray-300 font-menlo"
                  placeholder="NFT Description"
                  onChange={(e): void => setDescription(e.target.value)}
                  maxLength={100}
                  required={true}
                  rows={4}
                />
              </div>
              <div className="mt-4 flex items-center justify-center">
                <button
                  type="submit"
                  className="inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap
                  align-middle outline-offset-2 w-auto leading-5 rounded-3xl font-semibold transition h-10 text-md p-4
                  hover:bg-pink-600 bg-pink-400"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
