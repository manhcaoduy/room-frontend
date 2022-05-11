import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Nav from "../../utils/nav/nav";
import Loading from "../../utils/loading/loading";
import CreateSvg from "../../../resources/images/create.png";
import BuySvg from "../../../resources/images/buy.png";
import MintingSvg from "../../../resources/images/minting.png";
import SellSvg from "../../../resources/images/sell.png";
import TransactionService from "../../../services/api/action/action";
import {
  ActionType,
  UserAction,
} from "../../../services/api/action/action.dto";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import { trimLongDescription } from "../../../helpers/utils";

export default function Actions(): JSX.Element {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userActions, setUserActions] = useState<UserAction[]>([]);

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        setUserInfo(profile);
        TransactionService.getInstance()
          .getActions()
          .then((resp) => {
            const { actions } = resp;
            setUserActions(actions);
            setLoading(false);
          });
      });
  }, []);

  return (
    <>
      <Nav screen={4} username={userInfo ? userInfo.username : ""} />
      {loading && (
        <>
          <div className="w-full p-20 flex justify-center items-center absolute m-auto bg-transparent">
            <Loading />
          </div>
        </>
      )}
      {!loading && (
        <>
          <div className="flex flex-col w-full lg:w-2/3 p-8 m-auto">
            <div className="border flex justify-around">
              <div className="w-1/5 flex items-center justify-center border p-6 font-semibold text-lg font-menlo">
                Type
              </div>
              <div className="w-2/5 flex items-center justify-center border font-semibold text-lg font-menlo">
                Item
              </div>
              <div className="w-2/5 flex items-center justify-center border font-semibold text-lg font-menlo">
                Transaction
              </div>
            </div>
            {userActions.map((userAction) => {
              const { itemId, txHash, type, itemName } = userAction;
              return (
                <>
                  <div className="border flex justify-around">
                    <div className="w-1/5 flex items-center justify-center border p-6">
                      {type === ActionType.CREATE && (
                        <>
                          <img
                            src={CreateSvg}
                            className="w-6 h-6"
                            alt={"create-svg"}
                          />
                        </>
                      )}
                      {type === ActionType.BUY && (
                        <>
                          <img
                            src={BuySvg}
                            className="w-6 h-6"
                            alt={"buy-svg"}
                          />
                        </>
                      )}
                      {type === ActionType.MINT && (
                        <>
                          <img
                            src={MintingSvg}
                            className="w-6 h-6"
                            alt={"mint-svg"}
                          />
                        </>
                      )}
                      {type === ActionType.SELL && (
                        <>
                          <img
                            src={SellSvg}
                            className="w-6 h-6"
                            alt={"sell-svg"}
                          />
                        </>
                      )}
                    </div>
                    <div className="w-2/5 flex items-center justify-center border">
                      <a
                        href={`item/${itemId}`}
                        className="text-blue-500 font-bold underline"
                      >
                        {itemName}
                      </a>
                    </div>
                    <div className="w-2/5 flex items-center justify-center border">
                      {txHash !== "" && (
                        <a
                          href={`transaction/${txHash}`}
                          className="text-blue-500 font-bold underline"
                        >
                          {trimLongDescription(txHash, 10)}
                        </a>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
