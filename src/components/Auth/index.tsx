import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [name, setName] = useState<string>();
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post('https://chat-back-production-b8bf.up.railway.app/Auth/login', {
        name,
      })
      .then((response) => {
        setToken(response.data.token);
      });
  };
  useEffect(() => {
    sessionStorage.setItem('token', token);
  }, [token]);
  if (token) {
    navigate('/mails');
  }
  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
      <div>
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            name="name"
            className="border-4 p-2 rounded-lg"
            placeholder="name"
          />
          <button
            className="border-4 rounded-lg mt-5 font-bold"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
