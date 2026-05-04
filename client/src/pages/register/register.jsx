import { React, useRef, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {

  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const username = useRef();
  const workat = useRef();
  const age = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      toast.error("Passwords don't match. Please try again.");
      passwordAgain.current.focus();
      return;
    }

    const user = {
      email: email.current.value,
      password: password.current.value,
      username: username.current.value,
      workat: workat.current.value,
      age: age.current.value
    };

    try {
      const res = await axios.post('/api/auth/register', user);
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-red-50 to-red-100 py-10">
      <div className="flex flex-col md:flex-row w-[90%] max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Brand & Welcome */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-gradient-to-br from-red-600 to-red-800 text-white text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Social
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-8 text-red-50">
            Join the community. Connect with the world.
          </p>
          <div className="mt-8 hidden md:block">
            <Link to="/login" className="no-underline">
              <button className="px-8 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold border border-white/50 transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-lg hover:shadow-xl">
                Already have an account? Log In
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Account</h2>
            
            <form className="flex flex-col gap-4" onSubmit={handleClick}>
              <input 
                placeholder='Username' 
                ref={username} 
                type="text" 
                className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                required 
              />
              <input 
                placeholder='Email' 
                ref={email} 
                type="email" 
                className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                required 
              />
              
              <div className="flex gap-4">
                <input 
                  type="password" 
                  ref={password} 
                  className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                  placeholder='Password' 
                  minLength="6"
                  required 
                />
                <input 
                  type="password" 
                  ref={passwordAgain} 
                  className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                  placeholder='Confirm Password' 
                  required 
                />
              </div>

              <div className="flex gap-4">
                <input 
                  type="text" 
                  ref={workat} 
                  className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                  placeholder='Works At' 
                />
                <input 
                  type="number" 
                  ref={age} 
                  className="w-full h-12 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300" 
                  placeholder='Age' 
                />
              </div>

              <button 
                className={`w-full h-14 mt-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center ${isFetching ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`} 
                type="submit" 
                disabled={isFetching}
              >
                {isFetching ? <CircularProgress style={{color: 'white'}} size={24} /> : "Sign Up"}
              </button>
              
              <div className="mt-4 text-center md:hidden">
                <Link to="/login" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
                  Already have an account? Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
