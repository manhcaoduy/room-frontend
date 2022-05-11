import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import { ENUM } from "../../../resources/constants/enum";
import { INav } from "./nav.interface";
import LogoutSvg from "../../../resources/images/logout.png";
import { userInfo } from "os";

export default function Nav(props: INav): JSX.Element {
  const navigate = useNavigate();
  const { screen, username } = props;

  function onWallets(): void {
    navigate("/wallets");
  }

  function signOut(): void {
    AuthService.getInstance()
      .logout()
      .then(() => {
        localStorage.removeItem(ENUM.auth.accessTokenStorageKey);
        localStorage.removeItem(ENUM.auth.refreshTokenStorageKey);
        navigate("/login");
      });
  }

  return (
    <>
      <div className="sticky top-0 z-30">
        <div className="z-10 flex items-center justify-between pl-4 pr-4 h-16 border-2 border-solid bg-white">
          <div className="border-gray-200 break-words font-semibold font-menlo">
            <a href="/room" className="hover:text-red-600 text-lg">
              {username}&#39;s room
            </a>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <div className="flex items-center">
                <div className="mr-6">
                  <a
                    href="/marketplace"
                    data-name="menu-option"
                    className="text-gray-800 font-semibold text-sm font-menlo"
                  >
                    Explore
                  </a>
                </div>
                <div className="mr-6">
                  <a
                    href="/favorite"
                    data-name="menu-option"
                    className="text-gray-800 font-semibold text-sm font-menlo"
                  >
                    Favorite
                  </a>
                </div>
                <div className="mr-6">
                  <a
                    href="/collections"
                    data-name="menu-option"
                    className="text-gray-800 font-semibold text-sm font-menlo"
                  >
                    My NFT
                  </a>
                </div>
                <div>
                  <a
                    href="/actions"
                    data-name="menu-option"
                    className="text-gray-800 font-semibold text-sm font-menlo"
                  >
                    Actions
                  </a>
                </div>
              </div>
            </div>
            <div className="pr-4">
              <a
                className="cursor-pointer no-underline outline-none transition text-inherit"
                href="/upload"
              >
                <button
                  type="button"
                  className="inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap
                  align-middle outline-none w-auto leading-5 rounded-3xl font-semibold transition h-8 min-w-8 text-sm p-3
                  border-solid border-2 border-current text-pink-600 bg-transparent hover:bg-pink-100"
                >
                  Create
                </button>
              </a>
            </div>
            <div className="pr-4">
              <div className="flex">
                <button
                  type="button"
                  className="inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap
                  align-middle outline-none w-auto leading-5 rounded-3xl font-semibold transition h-8 min-w-8 text-sm
                  p-3 border-solid border-2 border-current text-inherit hover:bg-gray-100"
                  onClick={onWallets}
                >
                  Wallet
                  <span className="border-0 border-solid box-border select-none whitespace-nowrap leading-5 font-semibold text-sm text-inherit">
                    <div
                      aria-hidden="true"
                      // focusable="false"
                      className="flex items-center"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="416"
                          height="288"
                          x="48"
                          y="144"
                          fill="none"
                          strokeLinejoin="round"
                          strokeWidth="32"
                          rx="48"
                          ry="48"
                        ></rect>
                        <path
                          fill="none"
                          strokeLinejoin="round"
                          strokeWidth="32"
                          d="M411.36 144v-30A50 50 0 00352 64.9L88.64 109.85A50 50 0 0048 159v49"
                        ></path>
                        <path d="M368 320a32 32 0 1132-32 32 32 0 01-32 32z"></path>
                      </svg>
                    </div>
                  </span>
                </button>
              </div>
            </div>
            <div className="pr-4">
              <button onClick={signOut}>
                <img src={LogoutSvg} className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
