import {React,useContext} from "react";
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


function App () {

    const {user} = useContext(AuthContext);    
    return <>

    <Router>
    <Routes>
          
          
          
          <Route  path="/login" element={user ? <Navigate to="/" replace="true" /> : <Login />} />

          <Route  path="/profile/:userId" element={<Profile />} />
            
          
          <Route path="/register" element={user ? <Navigate to="/" replace="true" /> : <Register />} />
            
          
          <Route exact path="/" element={user ? <Home /> : <Login />} />
            
          
        </Routes>
    </Router>
        
    </>
}

export default App;