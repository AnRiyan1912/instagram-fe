import { ArrowLeftIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { Close } from '../../assets/icons';
import { Template } from '../../components/template/template';
import { useSelector } from 'react-redux';
import { api } from '../../api/axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, useToast } from '@chakra-ui/react';
import { io } from 'socket.io-client';

const socketConnection = io('https://api-socmed.jordanong.pw');

export const MessagePage = () => {
 const userSelector = useSelector((state) => state.auth);
 const [user, setUser] = useState({});
 const [message, setMessage] = useState('');
 const [messages, setMessages] = useState([]);

 const toast = useToast();

 const params = useParams();

 const sendMessage = () => {
  let stat = '';
  console.log('masuk');
  api
   .post('/messages', {
    message,
    receiver: user.id,
    sender: userSelector.id
   })
   .then((res) => {
    setMessage('');
    stat = 'success';
   })
   .catch((err) => {
    stat = 'error';

    console.log(err);
   })
   .finally(() => {
    toast({
     title: 'new message',
     status: stat,
     isClosable: true,
     position: 'top',
     duration: 1500
    });
   });
 };

 const fetchUser = async () =>
  api
   .get('/auth/username/' + params.username)
   .then((res) => {
    setUser(res.data); //sender
    fetchMessage(res.data.id); //get obrolan sender dengan reciever
    const to = [userSelector.id, res.data.id].sort((a, b) => a - b).toString(); //nama event
    console.log(to);
    socketConnection.on(`NEW_MESSAGE_${to}`, (newMessage) => {
     setMessages((oldState) => [...oldState, newMessage]);
    }); //menerima hasil dari socket emit 
   })
   .catch((err) => {
    console.log(err);
   });

 const fetchMessage = (userid) => {
  api
   .get('/messages', {
    params: {
     receiver: userid,
     sender: userSelector.id
    }
   })
   .then((res) => {
    setMessages([...messages, ...res.data]);
   })
   .catch((err) => {
    console.log(err);
   });
 };

 //  useEffect(() => {
 //   fetchUser();
 //   console.log('test');
 //  }, []);
 useEffect(() => {
  fetchUser();

  //  document.getElementById('scroller').scrollHeight;

  return () => {
   console.log('leave');
   socketConnection.disconnect();
  };
 }, []);

 useEffect(() => {
  try {
   const scroller = document.getElementById('scroller');
   scroller.scrollTo(0, scroller.scrollHeight);
  } catch (err) {}
 }, [messages]);

 return (
  <>
   <Template>
    <div
     id="scroller"
     className="w-full h-screen max-h-screen overflow-auto py-8 relative bg-white flex flex-col justify-between"
    >
     <div>
      <div className="w-full fixed max-w-[390px] bg-white z-10 top-0 ">
       <div className=" flex items-center m-3 ">
        <a href="/">
         {' '}
         <ChevronLeftIcon boxSize={'10'} />
        </a>
        <span className="font-semibold text-xl">{user?.username}</span>
       </div>
      </div>
      <div className=" p-7 h-full ">
       {messages?.map((msg, i) => {
        if (msg?.user_sender_id != userSelector.id && msg.user_sender_id)
         return (
          <div className=" flex justify-start mt-2" key={i}>
           <div className="flex gap-1 bg-gray-300 w-full max-w-[80%] py-2 px-1 rounded-lg">
            <Avatar
             width={'24px'}
             height={'24px'}
             src={user.image_url}
            ></Avatar>
            <span>{msg?.message}</span>
           </div>
          </div>
         );
        else if (msg?.user_sender_id) {
         return (
          // <div className="p-3 flex flex-col mt-2">
          <div className=" flex justify-end mt-2" key={i}>
           <div className="flex gap-1 max-w-[80%] w-full bg-blue-300  py-2 px-1 rounded-lg">
            <Avatar
             width={'24px'}
             height={'24px'}
             src={msg?.user_senders?.image_url}
            ></Avatar>
            <span>{msg?.message}</span>
           </div>
          </div>
          // </div>
         );
        }
       })}
      </div>
     </div>

     <div>
      <input
       className=" bottom-0 max-w-[390px] w-full p-3 bg-gray-100 fixed "
       placeholder="input message"
       value={message}
       onChange={(e) => {
        setMessage(e.target.value);
       }}
       onKeyPress={(e) => {
        if (e.key === 'Enter') sendMessage();
       }}
      ></input>
     </div>
    </div>
   </Template>
  </>
 );
};
