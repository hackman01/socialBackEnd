import { React, useContext } from "react";
import Home from "./pages/home/home.jsx";
import Login from "./pages/login/login.jsx";
import Profile from "./pages/profile/profile.jsx";
import Register from "./pages/register/register.jsx";


import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext.js";


function App() {

    const { user, loading } = useContext(AuthContext);

    // Show loading spinner while checking token on mount
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
                    <span className="text-white/60 text-sm font-medium">Loading...</span>
                </div>
            </div>
        );
    }

    return <>

        <Router>
            <Routes>


                <Route path="/login" element={user ? <Navigate to="/" replace="true" /> : <Login />} />

                <Route path="/profile/:userId" element={<Profile />} />


                <Route path="/register" element={user ? <Navigate to="/" replace="true" /> : <Register />} />


                <Route exact path="/" element={user ? <Home /> : <Login />} />


            </Routes>
        </Router>

    </>
}

export default App;