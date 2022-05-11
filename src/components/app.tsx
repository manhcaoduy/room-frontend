import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/api/auth/auth";

export default function App(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (!profile) {
          navigate("/login");
        } else {
          navigate("/marketplace");
        }
      });
  });

  return <></>;
}
