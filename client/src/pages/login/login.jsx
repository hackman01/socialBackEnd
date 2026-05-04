import { useRef, React, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="flex flex-col md:flex-row w-[90%] max-w-5xl h-auto md:h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side - Brand & Welcome */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-gradient-to-br from-red-600 to-red-800 text-white text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            Social
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-8 text-red-50">
            Connect with friends and the world.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-sm text-left w-full max-w-sm">
            <h4 className="font-bold text-white mb-2 uppercase tracking-wide">Test Credentials</h4>
            <div className="flex justify-between border-b border-white/20 pb-2 mb-2">
              <span className="text-white/80">Username:</span>
              <span className="font-medium">test@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Password:</span>
              <span className="font-medium">tester</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Welcome Back</h2>

            <form className="flex flex-col gap-5" onSubmit={handleClick}>

              <div>
                <input
                  placeholder='Email'
                  type="email"
                  className="w-full h-14 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  ref={email}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  minLength='6'
                  className="w-full h-14 px-5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
                  placeholder='Password'
                  ref={password}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full h-14 mt-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center ${isFetching ? 'opacity-80 cursor-wait' : ''}`}
                disabled={isFetching}
              >
                {isFetching ? <CircularProgress style={{ color: 'white' }} size={24} /> : "Log In"}
              </button>

              <div className="text-center mt-2">
                <span className="text-red-500 font-medium hover:text-red-700 cursor-pointer text-sm transition-colors">
                  Forgot Password?
                </span>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute border-t border-gray-200 w-full"></div>
                <span className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or</span>
              </div>

              <Link to="/register" className="w-full no-underline">
                <button
                  type="button"
                  className="w-full h-14 rounded-xl bg-white border-2 border-red-600 text-red-600 font-bold text-lg hover:bg-red-50 transition-all duration-300 shadow-sm"
                >
                  Create New Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
