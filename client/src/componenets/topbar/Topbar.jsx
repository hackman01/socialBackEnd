import React, { useContext,useEffect,useState } from "react";
import './Topbar.css';
import axios from "axios";
import { Search, Face, ExitToApp } from "@material-ui/icons";

import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

const PF = '/api/images/';



function Topbar(){

     const {user}=useContext(AuthContext);
     const [search,setSearch] = useState()
     const [drop,setDrop] = useState([])
     const [box,setBox] = useState(false)
     const [searchBox,setSearchBox] = useState(false)

     
     useEffect(()=>{
      const fetch = async ()=>{
        const list = await axios.post('/api/users/search',{userId:user._id,text:search})
        setDrop(list)
      }
      fetch()
     },[user._id,search])
     
     

    const Users=({user})=>{
      return <>
      

      
      <Link to={"/profile/"+user._id} style={{ textDecoration:'none',color:'black' }} >
       
        <div className="boxUser" onClick={()=>{setSearchBox(false)}}>
        <img src={user.profilePic ? PF+user.profilePic : PF+"person/noAvatar.png"} alt="" className="boxUserImg" />
        <span>{user.username}</span>
        </div>
        
      </Link>
      
      </>
    }

    const Box = () =>{
      return <>
        <div className="box">
          <div className="boxItem">
            {
            drop.data.map(user=>{
              return <Users key={user._id} user={user} />
            })}
          </div>
        </div>
      </> 
    }

    const HandleprofIcon = (e) => {
            e.preventDefault();
            setBox(!box)
    }

    const logoutHandler = () => {
      window.location.reload()
    }

const DisplayBox = () =>{
  return <>
    <div className="logoutContainer">
      <button className="logoutBtn" >

      <Link to={`/profile/${user._id}`} className="logoutBtn" style={{textDecoration : 'none',color : 'black'}} >
         <span style={{margin: '10px'}} >Profile</span>
        <Face />
      </Link>

        
      </button>
      <button onClick={logoutHandler} className="logoutBtn" >
        <Link to="/" className="logoutBtn" style={{textDecoration : 'none',color : 'black'}} >
        <span style={{margin: '10px'}} >Logout</span>
        <ExitToApp />
        </Link>
      </button>
    </div>
  </>
}


     return <>
        <div className="topbar-container">
          <div className="topbar-left">
            <Link to='/' style={{ textDecoration:'none',color:'black' }} >
            <span className="logo">Social</span>
            </Link>
          </div>
          <div className="topbar-centre">
            
            <input placeholder="Search for friends" value={search} onFocus={()=>setSearchBox(true)} onChange={(e)=>{setSearch(e.target.value)}} className="searchBar" /> 
            
            <Search className="mgf"  />
            
            
            {search && searchBox ?<Box />:null}
          </div>
          <div className="topbar-right">
             <div className="topbar-links">
            <Link to='/' style={{textDecoration : 'none',color : 'white'}} >
            <span className="topbar-link">Homepage</span>
            </Link>
             <Link to={`/profile/${user._id}`} style={{textDecoration : 'none',color : 'white'}} >
             <span className="topbar-link">Timeline</span>
             </Link>
               

             </div>
               
            
            {/* <div className="topbar-icons">
            <div className="topbar-icon">
             <Person />
             <span className="icon-counter">1</span>
             </div>
             <div className="topbar-icon">
             <Chat />
             <span className="icon-counter">2</span>
             </div>
             <div className="topbar-icon">
             <Notifications />
             <span className="icon-counter">1</span>
             </div>
            </div> */}
            <label htmlFor="btn">
            <img alt="user" src={user.profilePic ? PF+user.profilePic : PF+"person/noAvatar.png"} className="img" />
              <button id="btn" style={{display : "none"}} onClick={HandleprofIcon} >

              </button>
            </label>
            {box && <DisplayBox />}
            
            
            
          </div>
        </div>
        
     </>
}

export default Topbar;