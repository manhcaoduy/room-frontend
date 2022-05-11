import React, { useEffect, useState } from "react";
import Nav from "../../utils/nav/nav";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Loading from "../../utils/loading/loading";
import MetamaskWalletService from "../../../services/wallet/metamask";
import UserWalletService from "../../../services/api/user-wallet/user-wallet";
import { WalletTypeEnum } from "../../../resources/constants/enum";
import MetamaskLogo from "../../../resources/images/metamask.png";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import { UserWallet } from "../../../services/api/user-wallet/user-wallet.dto";

export default function Wallets(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userWallets, setUserWallets] = useState<UserWallet[]>([]);

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        UserWalletService.getInstance()
          .getWallets()
          .then((resp) => {
            const { userWallets } = resp;
            setUserWallets(userWallets);
            setUserInfo(profile);
            setLoading(false);
          });
      });
  }, []);

  function addMetamaskWallet(): void {
    MetamaskWalletService.getInstance()
      .linkWallet()
      .then((resp) => {
        const { userWallet } = resp;
        const newUserWallets = [...userWallets, userWallet];
        setUserWallets(newUserWallets);
      });
  }

  function disconnectWallet(req: {
    walletAddress: string;
    network: WalletTypeEnum;
  }): void {
    const { walletAddress, network } = req;
    switch (network) {
      case WalletTypeEnum.EVM: {
        MetamaskWalletService.getInstance().disconnectAddress({
          walletAddress,
        });
        const newUserWallet = userWallets.filter(
          (userWallet) =>
            userWallet.address !== walletAddress ||
            userWallet.network !== network
        );
        setUserWallets(newUserWallet);
        break;
      }
    }
  }

  return (
    <>
      <Nav screen={-1} username={userInfo ? userInfo.username : ""} />
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="w-1/2 m-auto p-10 border-b-2 border-gray-200">
            <div className="font-semibold font-menlo text-lg text-center">
              Connect wallet
            </div>
            <div className="flex justify-center items-center">
              <div className="cursor-pointer mt-4">
                <button
                  className="bg-gray-50 rounded-3xl px-4 py-6 flex flex-col justify-center items-center
                    text-center border-2 border-dashed border-gray-300 transition hover:bg-gray-100"
                  onClick={(): void => {
                    addMetamaskWallet();
                  }}
                >
                  <div className="mb-3 w-12 h-12 flex items-center justify-center border-2 border-solid border-gray-800 rounded-full text-sm">
                    <svg
                      viewBox="0 0 24 24"
                      focusable="false"
                      className="w-6 h-6 inline-block leading-4 shrink-0 text-current align-middle"
                    >
                      <path
                        fill="currentColor"
                        d="M0,12a1.5,1.5,0,0,0,1.5,1.5h8.75a.25.25,0,0,1,.25.25V22.5a1.5,1.5,0,0,0,3,0V13.75a.25.25,0,0,1,.25-.25H22.5a1.5,1.5,0,0,0,0-3H13.75a.25.25,0,0,1-.25-.25V1.5a1.5,1.5,0,0,0-3,0v8.75a.25.25,0,0,1-.25.25H1.5A1.5,1.5,0,0,0,0,12Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-sm font-menlo font-semibold">
                    Metamask
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full m-auto p-10">
            <div className="w-1/2 m-auto">
              <div className="font-semibold font-menlo text-lg m-auto text-center mt-4">
                Your wallet
              </div>
              <div className="flex flex-col space-x-5 justify-center items-center m-auto">
                {userWallets.map((userWallet) => {
                  const { address, network } = userWallet;
                  return (
                    <>
                      <div className="flex flex-row justify-around w-full p-4">
                        <div className="flex space-x-4">
                          {network === WalletTypeEnum.EVM && (
                            <img
                              className="w-10 h-10"
                              src={MetamaskLogo}
                              alt={"metamask logo"}
                            />
                          )}
                          <div className="font-bold text-center my-auto">
                            {address}
                          </div>
                        </div>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                          onClick={(): void =>
                            disconnectWallet({
                              walletAddress: address,
                              network,
                            })
                          }
                        >
                          Disconnect
                        </button>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
