import {React,useRef,useContext} from 'react';
import './register.css';
import axios from 'axios';

import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';


export default function Register() {
   
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const username = useRef();
  const workat = useRef();
  const age = useRef();
  const { isFetching,dispatch } = useContext(AuthContext);
 

  const handleClick = async (e)=>{

   e.preventDefault();
   if(passwordAgain.current.value!==password.current.value)
   {
    passwordAgain.current.setCustomValidity("Password don't match!");
   }
   else {

    const user = {
      email : email.current.value,
   password : password.current.value,
   passwordAgain : passwordAgain.current.value,
   username : username.current.value,
   workat : workat.current.value,
   age : age.current.value
    }

    try{
      await axios.post('auth/register',user);
      await loginCall({ email:email.current.value , password:password.current.value},dispatch);
      

    }catch (err){
      console.log(err);
    }

   }
  };


  return (
    
        <div className="login">
      <div className="login-container">
        <div className="login-text">
            <div className="login-logo">
                Social
            </div>
            <div className="login-msg">
                Connect with friends and world.
            </div>
        </div>
        <form className="login-box">
            <input placeholder='Email' ref={email} type="email" className="email" />
            <input placeholder='Username' ref={username} type="text" className="email" />
            <input type="password" ref={password} className="password" placeholder='Password' />
            <input type="password" ref={passwordAgain} className="cp" placeholder='Confirm Password'/>
            <input type="text" ref={workat} className="WorksAt" placeholder='Works At' />
            <input type="text" ref={age} className="DOB" placeholder='Age'/>
            <button className="register-btn" type="submit" onClick={handleClick} >{isFetching ? <CircularProgress color='white' size='20px' /> : "Register"}</button>
            
        </form>
      </div>
    </div>
    
  )
}
