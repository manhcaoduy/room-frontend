import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Nav from "../../utils/nav/nav";
import Loading from "../../utils/loading/loading";
import BlockchainService from "../../../services/blockchain/blockchain";
import { UserInfo } from "../../../services/api/auth/auth.dto";
import { TransactionDto } from "../../../services/blockchain/blockchain.dto";

export default function Transaction(): JSX.Element {
  const { id } = useParams();

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const [transaction, setTransaction] = useState<TransactionDto>();

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
          return;
        }
        if (!id) {
          navigate("/");
          return;
        }
        setUserInfo(profile);
        BlockchainService.getInstance()
          .getTxByTxHash({ txHash: id })
          .then((resp) => {
            const { transaction } = resp;
            setTransaction(transaction);
            setLoading(false);
          });
      });
  }, []);

  return (
    <>
      <Nav screen={-1} username={userInfo ? userInfo.username : ""} />
      {loading && (
        <>
          <div className="w-full p-20 flex justify-center items-center absolute m-auto bg-transparent">
            <Loading />
          </div>
        </>
      )}
      {!loading && (
        <>
          <div className="flex flex-col p-8 m-auto md:w-2/3 space-y-4 font-menlo">
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 p-2 font-normal">
                <div className="text-center">Transaction Hash</div>
              </div>
              <div className="w-3/4 flex items-center justify-center bg-gray-200">
                <div className="text-center text-sm ">{transaction?.hash}</div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 bg-gray-200 p-2 font-normal">
                <div className="text-center">Transaction Index</div>
              </div>
              <div className="w-3/4 flex items-center justify-center">
                <div className="text-center text-sm ">
                  {transaction?.transactionIndex}
                </div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 bg-gray-200 p-2 font-normal">
                <div className="text-center">Block Hash</div>
              </div>
              <div className="w-3/4 flex items-center justify-center">
                <div className="text-center text-sm ">
                  {transaction?.blockHash}
                </div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 p-2 font-normal">
                <div className="text-center">Block Number</div>
              </div>
              <div className="w-3/4 flex items-center justify-center bg-gray-200">
                <div className="text-center text-sm ">
                  {transaction?.blockNumber}
                </div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 bg-gray-200 p-2 font-normal">
                <div className="text-center">From</div>
              </div>
              <div className="w-3/4 flex items-center justify-center">
                <div className="text-center text-sm ">{transaction?.from}</div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 p-2 font-normal">
                <div className="text-center">Gas</div>
              </div>
              <div className="w-3/4 flex items-center justify-center bg-gray-200">
                <div className="text-center text-sm ">{transaction?.gas}</div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 bg-gray-200 p-2 font-normal">
                <div className="text-center">Gas Price</div>
              </div>
              <div className="w-3/4 flex items-center justify-center">
                <div className="text-center text-sm ">
                  {transaction?.gasPrice}
                </div>
              </div>
            </div>
            <div className="flex border-2 w-full rounded-lg">
              <div className="w-1/4 p-2 font-normal">
                <div className="text-center">Nonce</div>
              </div>
              <div className="w-3/4 flex items-center justify-center bg-gray-200">
                <div className="text-center text-sm ">{transaction?.nonce}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
