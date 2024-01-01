import React, { useEffect,useContext } from "react";
import './Feed.css';
import { useState } from "react";
import {Comment, Send, ThumbUp} from '@material-ui/icons';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const PF = '/api/images/';



const Feed = ({post}) =>
{
    const [user,setUser] = useState({});

    const { user : currentUser } = useContext(AuthContext);

    const [like,setLike] = useState(post.likes.length);
    const [isLiked,setIsLiked] = useState(false);

   useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id));
   },[currentUser._id,post.likes]);

    useEffect(()=>{
      const fetchUser = async () => {
       const res = await axios.get(`/api/users?userId=${post.userId}`);
       setUser(res.data);
      }
      fetchUser();
    },[post.userId])


     const likeHandler = () =>{

      try{
         axios.put(`/api/posts/${post._id}/like`,{userId : currentUser._id});
       }catch(err){
         console.log(err);
       }

        setLike(isLiked ? like-1 : like+1);
        setIsLiked(!isLiked);
     }
   
   

    return <div className="feed-post">
    <Link to={"/profile/"+post.userId} style={{ textDecoration:'none',color:'black' }} >
    <div className="post-top">
         <img src={user.profilePic ? PF+user.profilePic : PF+"person/noAvatar.png"} alt="user" className="img" />
         <span>{user.username}</span>
    </div> 
    </Link>   
    <div className="post-mid">
         <span className="description">
            {post.desc}
         </span>
         {post.img && <img src={PF+post.img } alt="pic" className="post-pic" />}
    </div> 
    <div className="post-bottom">
            <div className="bottom-icons">
                <div className="bottom-left">
                <ThumbUp className="bottom-icon" onClick={likeHandler} />
                <Send className="bottom-icon inactive" />
                </div>
                <div className="bottom-right">
                <Comment className="bottom-icon inactive" />
                </div>
            </div>
                <span className="likes">Liked by {like} people.</span>
     
    </div>
 </div>
}

export default Feed;