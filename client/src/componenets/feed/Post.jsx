import React, { useContext,useRef ,useState} from "react";
import './Feed.css';
import {Cancel,  Photo} from '@material-ui/icons';
import {AuthContext} from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';


const PF = '/api/images/';

function Post({reRender}){

const desc = useRef();
const [loading,setLoading] = useState(false);
const {user} = useContext(AuthContext);
const [fileImg,setFileImg] = useState(null);

const submitHandler = async (e) => {
    
     e.preventDefault();
     setLoading(true);
     const newPost = {
          userId:user._id,
          desc:desc.current.value,
     }

     if(fileImg)
     {
          const data = new FormData();
          const fileName =  Date.now() + fileImg.name;
          // const file = new File(file, fileName);
          data.append("file",fileImg,fileName);
          // data.append("name",fileName);
          newPost.img = fileName;

          try{
              const img = await axios.post("/api/upload",data);
              newPost.img = img.data.url;
          } catch(err)
          {
               console.log(err);
          }
     }

     try{
       await axios.post("/api/posts",newPost);
     }catch(err)
     {
          console.log(err);
     }finally{
          setLoading(false);
     }
     reRender(Math.random())
     desc.current.value=""
     setFileImg(null)
     
}


    return      <div className="feed-post">
    <div className="post-top">
         <Link to={`/profile/${user._id}`}>
         <img src={user.profilePic ? user.profilePic : PF+"person/noAvatar.png"} alt="user" className="img" />
         </Link>
         <span>{user.username}</span>
    </div>    

    <form className="post-bottom" onSubmit={submitHandler} >
 
    <div className="post-mid">
         <textarea className="post-content" placeholder="What's on your mind?" ref={desc}></textarea>
    </div> 
    {fileImg && (
     <div className="shareImgContainer">
          <img src={URL.createObjectURL(fileImg)} alt="" className="shareImg" />
          <Cancel className="cancelShareImg" onClick={()=>{setFileImg(null)}} />
     </div>
    )}
    <div className="bottom-icons">
     <div className="bottom-left">
     
    <label htmlFor="fileImg" className="picUpload">
    <Photo className=" photo" />
     <span className="pointer">Photo or Video</span>
     <input type="file" id="fileImg" accept=".png,.jpeg,.jpg" style={{ display : "none" }} onChange={(e)=>{
          setFileImg(e.target.files[0])
     }} />
    </label>
     
     {/* <Label className=" tag" />
     <span className="pointer">Tag</span>
     
     <TagFaces className=" feeling" />
     <span className="pointer">Feelings</span>
     
     <LocationOn className=" location" />
     <span className="pointer">Location</span> */}
     
     </div>
     <div className="bottom-right">
     <button className="post-button" type="submit" disabled={loading}>{loading ? "Posting..." : "Share"}</button>
     </div>
     </div>
     
    </form>
 </div>
}

export default Post;