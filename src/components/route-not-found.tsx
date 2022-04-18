import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RouteNotFoundPage(): JSX.Element {
  return (
    <>
      <Navigate to="/" />
    </>
  );
}
