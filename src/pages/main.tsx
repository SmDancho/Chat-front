import { user } from '../types';

import { useState, useEffect } from 'react';
import { Auth } from '../components/Auth';
import { Chat } from '../components/Chat/chat';
import axios from 'axios';

export function MainPage() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState<user>();

  useEffect(() => {
    axios
      .get('https://sockets-server.herokuapp.com/auth/getme', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setToken(response.data.token);
        setUser(response.data.User);
      });
  }, [token]);

  return <div>{token ? <Chat {...(user as user)} /> : <Auth />}</div>;
}
