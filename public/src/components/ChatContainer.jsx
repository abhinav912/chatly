import React ,{useState,useEffect, useRef}from 'react'
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import { getMessageRoute,sendMessageRoute } from '../utils/APIRoutes';
import {v4 as uuidv4} from "uuid";
export default function ChatContainer({currentChat,currentUser, socket}) {

    // const [currentChatName, setcurrentChatName] = useState(undefined);
    // const [currentChatImage, setcurrentChatImage] = useState(undefined);
    // const [currentChatId, setcurrentChatId] = useState(undefined);
    // const [currentUserId, setcurrentUserId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage,setArrivalMessage]=useState(null);
    const scrollRef=useRef();
    // const getUserData=async () => {
    //     if(currentChat){
    //     setcurrentChatName(currentChat.username);
    //     setcurrentChatImage(currentChat.avatarImage);
    //     setcurrentChatId(currentChat._id);
    //     setcurrentUserId(currentUser._id);
    // }}
    //   useEffect(()=>{
    //       getUserData();
    //   },[currentChat]);

      const getResponse=async()=>{
        if(currentChat){
        const response=await axios.post(getMessageRoute,{
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data) ;    
      }}

      useEffect(() => {
        getResponse(); 
      },[currentChat]);

      const handleSendMsg = async(msg) =>{
      await axios.post(sendMessageRoute,{
        from:currentUser._id,
        to:currentChat._id,
        message:msg,
      });
      socket.current.emit("send-msg",{
        from:currentUser._id,
        to:currentChat._id,
        message:msg,
      });
      const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <>
    {currentChat && (
      <Container>
      <div className="chat-header">
          <div className='user-details'>
              <div className='avatar'>
              <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt="avatar"
                  />
              </div>
              <div className='username'>
                  <h3>{currentChat.username}</h3>
              </div>
          </div>
      
      </div>
      <div className="chat-messages">
      {messages.map((message) => {
        return (
          <div ref={scrollRef} key={uuidv4()}>
          
            <div
              className={`message ${
                message.fromSelf ? "sent" : "recieved"
              }`}
            >
              <div className="content ">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
      <ChatInput handleSendMsg={handleSendMsg}/>
    </Container>
    )

    }
    
    
    </>
      
  
  );
}



const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #ffffff;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #522cab;
        color: #ffffff;

      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #646464;
        color: #ffffff;
      }
    }
  }
`;

