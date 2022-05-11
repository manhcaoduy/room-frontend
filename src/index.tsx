import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/auth/login";
import RouteNotFoundPage from "./components/route-not-found";
import Register from "./components/pages/auth/register";
import App from "./components/app";
import { Provider } from "react-redux";
import store from "./redux";
import Favorite from "./components/pages/favorite/favorite";
import Marketplace from "./components/pages/marketplace/marketplace";
import Upload from "./components/pages/upload/upload";
import Collections from "./components/pages/collections/collections";
import Item from "./components/pages/item/item";
import Wallets from "./components/pages/wallets/wallets";
import Actions from "./components/pages/actions/actions";
import Transaction from "./components/pages/actions/transaction";
import ItemWallet from "./components/pages/item/item-wallet";
import Room from "./components/pages/room/room";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<ItemWallet />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="/room" element={<Room />} />

        <Route path="*" element={<RouteNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
