import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/api/auth/auth";
import Room from "../../../resources/images/room.png";

export default function Register(): JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function verifyForm(): boolean {
    if (password !== confirmedPassword) {
      setError("Password must be identical to confirmed password");
      setIsError(true);
      return false;
    }
    return true;
  }

  function handleSubmit(event: any): void {
    event.preventDefault();

    if (!verifyForm()) {
      return;
    }

    AuthService.getInstance()
      .register({ email, password, username })
      .then((response) => {
        navigate("/");
      });
  }

  return (
    <>
      <div className="bg-gray-900">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{ backgroundImage: `url(${Room})` }}
          ></div>

          <div className="flex flex-col justify-center items-center items-center space-y-8 w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="font-bold text-white text-3xl">Register</div>
              <div className="text-white">
                Create an account and so your own room
              </div>
            </div>

            <form className="w-full appearance-none" onSubmit={handleSubmit}>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="email"
                  name="email"
                  className="block py-2.5 px-0 w-full text-base bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  onChange={(event): void => {
                    setEmail(event.target.value);
                  }}
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email
                </label>
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="username"
                  className="block py-2.5 px-0 w-full text-base bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  onChange={(event): void => {
                    setUsername(event.target.value);
                  }}
                />
                <label
                  htmlFor="username"
                  className="peer-focus:font-medium absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Username
                </label>
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="password"
                  name="password"
                  className="block py-2.5 px-0 w-full text-base bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  onChange={(event): void => {
                    setPassword(event.target.value);
                  }}
                />
                <label
                  htmlFor="password"
                  className="peer-focus:font-medium absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
              </div>

              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="password"
                  name="confirmedPassword"
                  className="block py-2.5 px-0 w-full text-base bg-transparent border-0 border-b-2 appearance-none text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  onChange={(event): void => {
                    setConfirmedPassword(event.target.value);
                  }}
                />
                <label
                  htmlFor="confirmedPassword"
                  className="peer-focus:font-medium absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confirm Password
                </label>
              </div>
              {isError ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : (
                <></>
              )}

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="text-white focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                >
                  Submit
                </button>
              </div>
            </form>
            <div className="text-center text-white">
              {"Already had an account?"}
              <span className="p-2 text-blue-400">
                <a href="/login">Log in</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
