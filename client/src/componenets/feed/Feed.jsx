import React, { useEffect,useContext } from "react";
import './Feed.css';
import { useState } from "react";
import {Comment, DeleteOutline, Send, ThumbUp} from '@material-ui/icons';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const PF = '/api/images/';



const Feed = ({post, setPostRender}) =>
{
    const [user,setUser] = useState({});

    const { user : currentUser } = useContext(AuthContext);

    const [like,setLike] = useState(post.likes.length);
    const [isLiked,setIsLiked] = useState(false);

    const deleteHandler = async (e) =>{
      e.preventDefault();
      e.stopPropagation();
    try{
        const res = await axios.delete(`/api/posts/${post._id}`,{data:{userId : currentUser._id}});
        if(res.status === 200)  
        {
            setPostRender(Math.random());
        }
    }catch(err){
        console.log(err);
    }
    }

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


     const likeHandler = async () =>{

      try{
         await axios.put(`/api/posts/${post._id}/like`,{userId : currentUser._id});
       }catch(err){
         console.log(err);
       }

        setLike(isLiked ? like-1 : like+1);
        setIsLiked(!isLiked);
     }
   
   

    return <div className="feed-post">
    <Link to={"/profile/"+post.userId} style={{ textDecoration:'none',color:'black' }} >
    <div className="feed-top">
        <div className="post-top-left">
        <img src={user.profilePic ? user.profilePic : PF+"person/noAvatar.png"} alt="user" className="img" />
        <span>{user.username}</span>
        </div>
         
        {currentUser._id === post.userId && <DeleteOutline className="delete" style={{ fontSize: 30 }} onClick={deleteHandler}/>}
    </div> 
    </Link>   
    <div className="post-mid">
         <span className="description">
            {post.desc}
         </span>
         {post.img && <img src={post.img} alt="pic" className="post-pic" />}
    </div> 
    <div className="post-bottom">
            <div className="bottom-icons">
                <div className="bottom-left">
                <ThumbUp className="bottom-icon" onClick={likeHandler} />
                {/* <Send className="bottom-icon inactive" /> */}
                </div>
                <div className="bottom-right">
                {/* <Comment className="bottom-icon inactive" /> */}
                </div>
            </div>
                <span className="likes">Liked by {like} people.</span>
     
    </div>
 </div>
}

export default Feed;