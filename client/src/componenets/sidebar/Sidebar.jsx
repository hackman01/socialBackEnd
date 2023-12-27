import React from "react";
import { useState,useEffect,useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import './Sidebar.css';
import axios from 'axios';
import {RssFeed, Chat,  GroupAdd} from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

import { Link } from 'react-router-dom';

const PF = process.env.REACT_APP_PUBLIC_FOLDER;


const CloseFriend = ({user}) =>{
   
   return <><Link to={`/profile/${user._id}`} style={{ textDecoration:'none',color:'black' }} >
   <div className="friend">
     <img src={user.profilePic?PF+user.profilePic:PF+"person/noAvatar.png"} alt="user" className="img"/>
     <span>{user.username}</span>   
   </div>
   </Link>
    </>


}



function Sidebar(){
  const { user:cuser } = useContext(AuthContext);

  const [Users,setUsers] = useState([])
  const [load,setLoad] = useState(true)

useEffect(() => {
  const fetchFriends = async () =>{
    try{
    const friends = await axios.get(`/users/followers/${cuser._id}`)
    setUsers(friends.data);
    setLoad(false);
    }
    catch(err)
    {
      console.log(err);
      // fetchFriends();
    }
  }
  fetchFriends();
},[cuser._id])

    return <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-list">
            <Link to="/" style={{ textDecoration:'none',color:'black' }} >
            <li className="sidebar-list-item">
              <RssFeed className="sidebar-icon"/>
              <span>Feed</span>
            </li>
            </Link>
            <li className="sidebar-list-item inactive">
              <Chat className="sidebar-icon"/>
              <span>Chats</span>
            </li>
         
            <li className="sidebar-list-item inactive">
              <GroupAdd className="sidebar-icon" />
              <span>Groups</span>
            </li>
        
           
        </div>
        
        <hr />
        <h3>Followers</h3>
        <div className="friends-list">
           {load ? <div className="load" ><CircularProgress style={{color : 'brown',display : 'block',margin : 'auto',padding : '50px',fontSize : '5px'}} /></div> :
            Users.map(u=>{
             return <CloseFriend key={u.id} user={u}/>
            })
           }
        </div>
      </div>
    </div>
}

export default Sidebar;