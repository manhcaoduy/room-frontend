import React, { useState } from "react";
import { IndexProp } from "./popup.interface";
import Loading from "../loading/loading";

export default function Popup({
  isOpen,
  setIsOpen,
  handleEnable,
}: IndexProp): JSX.Element {
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(): void {
    setIsLoading(true);
    handleEnable(price).catch(() => {
      setIsLoading(false);
    });
  }

  return (
    <>
      <div
        className={`fixed ${
          isOpen ? "" : "hidden"
        } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
      >
        <div className="relative top-40 mx-auto shadow-lg rounded-md bg-white max-w-md bg-gray-500">
          <div className="p-10">
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            )}
            {!isLoading && (
              <>
                <div className="absolute top-0 right-0 h-2 w-5">
                  <button
                    className="text-lg text-white"
                    onClick={(): void => setIsOpen(false)}
                  >
                    X
                  </button>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="flex flex-col items-center justify-center">
                    <label htmlFor="price" className="font-semibold font-menlo">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="text-black block py-2.5 px-0 text-base bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      required
                      onChange={(event): void => {
                        setPrice(Number(event.target.value));
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button className="mt-4 py-2 w-24 rounded-3xl bg-red-400 hover:bg-red-600">
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
