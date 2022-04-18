import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../lib/api/auth';

export default function App(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.getInstance().hasLocalStorageAccessToken()) {
      navigate('/login');
    }
  }, []);

  return (
    <>
      <h1>MainPage</h1>
    </>
  );
}
