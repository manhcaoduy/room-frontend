import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../lib/api/auth';

export default function App(): JSX.Element {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.getInstance()
      .getProfile()
      .then((profile) => {
        if (profile) {
          setEmail(profile.email);
        } else {
          navigate('/login');
        }
      });
  }, []);

  return (
    <>
      <h1>Welcome {email}</h1>
    </>
  );
}
