import {useRef,React,useContext,useState} from 'react'
import './login.css';
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';


export default function Login() {

const email = useRef();
const password = useRef();
const { user, isFetching, error, dispatch } = useContext(AuthContext);
const [err,setErr] = useState(false)
  const handleClick = async (e) =>{
    e.preventDefault();
    try{
    await loginCall({ email:email.current.value , password:password.current.value},dispatch);
    }catch(err){
    
      setErr(true)
    }
    
  }
  console.log(user);

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
       
       {console.log(error)}
        <form className="login-box" onSubmit={handleClick}>
        {err ? <span>Email or password is wrong!!</span> : null} 
            <input placeholder='Email' type="email" className="email" ref={email}/>
            <input type="password" minLength='6' className="password" placeholder='Password' ref={password}/>
            <button type="submit" className="login-btn">{isFetching ? <CircularProgress color='white' size='20px' /> : "Login"}</button>
            <span className="fgt-pass">Forgot Password?</span>
            <Link to="/register" >
            <button className="signup-btn">Sign Up</button>
            </Link>
          
        </form>
      </div>
    </div>
    
  )
}
