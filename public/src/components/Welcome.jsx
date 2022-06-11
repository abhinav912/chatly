import React, {useEffect,useState} from 'react';
import styled from 'styled-components';
import Robot from "../assets/robot.gif";
import Logout from './Logout';
export default function Welcome({currentUser}) {
    // console.log(currentUser.username);
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const getUserData=async () => {
        if(currentUser){
        setCurrentUserName(currentUser.username);
      }}
      useEffect(()=>{
          getUserData();
      },[currentUser]);

  return (
    <Container>
         <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{currentUserName} !</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
      
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 30rem;
  }
  span {
    color: #4e0eff;
  }
`;
