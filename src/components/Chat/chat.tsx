import { user } from '../../types';

import { FC, useState, useMemo, useEffect } from 'react';
import { io } from 'socket.io-client';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

const socket = io('https://sockets-server.herokuapp.com/');

interface newestMessages {
  message?: string | undefined;
  sender?: string | undefined;
  Topic?: string | undefined;
  isVisible: number;
}
interface users {
  name: string;
}
export const Chat: FC<user> = ({ name, message }) => {
  const [newestMessages, setnewestMessages] = useState<newestMessages>();
  const [oldMessageState, setmessageState] = useState<newestMessages[]>([]);
  const [allusers, setallusers] = useState<users[]>([]);
  const [senTopic, setsenTopic] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [reciver, setReciver] = useState<string>('');
  const [isOpenForm, setisOpenForm] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMessageOpen, setisMessageOpen] = useState(false);

  useEffect(() => {
    parseArr();
    axios
      .get('https://sockets-server.herokuapp.com/auth/users')
      .then((response) => setallusers(response.data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useMemo(() => {
    if (name) {
      socket.emit('user_connected', name);
    }
  }, [name]);

  socket.on('newMessage', (data) => {
    setnewestMessages(data);
  });

  const parseArr = () => {
    const parsed = message ? JSON.parse(message) : '';
    if (Array.isArray(parsed)) {
      const oldMsgArr: newestMessages[] = [];
      parsed.slice(1).map((item) => oldMsgArr.push(JSON.parse(item)));
      setmessageState(oldMsgArr.reverse());
    }
  };

  const optionsForSelectInput = allusers && allusers?.map((user) => {
    return {
      value: user.name,
      label: user.name,
    };
  });

  return (
    <div className="w-[1280px] m-auto ">
      <div className="border-[1px] border-[#cccccc] rounded p-2 ">
        <h3 className="font-bold flex justify-between">
          <div>messages </div>
          <div>user:{name}</div>
        </h3>
        <div className="flex flex-col">
          <>
            {newestMessages && (
              <ul className="mt-4">
                <li>sender: {newestMessages?.sender}</li>
                <li
                  className="border-[1px] w-[200px] rounded-full p-2 border-[#cccccc] cursor-pointer"
                  onClick={() => {
                    if (newestMessages.isVisible === 0) {
                      newestMessages.isVisible = 1;
                    } else {
                      newestMessages.isVisible = 0;
                    }

                    setisMessageOpen((prev) => !prev);
                  }}
                >
                  {newestMessages?.Topic}
                </li>
                {newestMessages.isVisible === 1 ? (
                  <li className="border-[1px] rounded">
                    message: {newestMessages.message}
                  </li>
                ) : (
                  ''
                )}
                <hr />
              </ul>
            )}

            {oldMessageState?.map((item) => {
              return (
                <ul className="mt-4">
                  <li>sender: {item.sender}</li>
                  <li
                    onClick={() => {
                      if (item.isVisible === 0) {
                        item.isVisible = 1;
                      } else {
                        item.isVisible = 0;
                      }

                      setisMessageOpen((prev) => !prev);
                    }}
                    className="border-[1px] w-[200px] rounded-full p-2 border-[#cccccc] cursor-pointer"
                  >
                    {item.Topic}
                  </li>
                  {item.isVisible === 1 ? (
                    <li className="border-[1px] rounded">
                      message: {item.message}
                    </li>
                  ) : (
                    ''
                  )}
                  <hr />
                </ul>
              );
            })}
          </>
        </div>
      </div>
      <div className=" flex justify-start items-start mt-5 h-[100vh]">
        {isOpenForm ? (
          <div className="flex flex-col  gap-4 ">
            <Autocomplete
              //@ts-ignore
              value={reciver}
              inputValue={reciver}
              onInputChange={(event, newInputValue) => {
                setReciver(newInputValue);
              }}
              id="controllable-states-demo"
              options={optionsForSelectInput}
              renderInput={(params) => <TextField {...params} label="Users" />}
            />
            <input
              className="w-[300px] border-[1px] border-[#cccccc] rounded p-2"
              type="text"
              placeholder="topic"
              onChange={(e) => {
                setsenTopic(e.target.value);
              }}
            />
            <textarea
              className="w-[300px] border-[1px] border-[#cccccc] rounded resize-none p-4"
              placeholder="topic"
              onChange={(e) => setSentMessage(e.target.value)}
            />
            <button
              className="border-[1px] border-[#cccccc] rounded p-2"
              onClick={() => {
                socket.emit('private message', {
                  sender: name,
                  recipient: reciver,
                  message: sentMessage,
                  Topic: senTopic,
                  isVisible: 0,
                });
              }}
            >
              submit
            </button>
          </div>
        ) : (
          <div className="flex w-full items-start">
            <button
              onClick={() => setisOpenForm((prev) => !prev)}
              className="border-4 rounded-lg p-2"
            >
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
