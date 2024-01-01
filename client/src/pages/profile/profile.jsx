import React from "react";
import Topbar from "../../componenets/topbar/Topbar";
import Sidebar from "../../componenets/sidebar/Sidebar";
import Feeds from "../../componenets/feed/Feeds";
import Rightbar from "../../componenets/rightbar/Rightbar";
import './profile.css';
import axios from 'axios';
import { useState,useEffect,useContext } from "react";
import { useParams } from 'react-router';
import { CameraAlt } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";


const PF = '/api/images/';





function Profile()
{
    const [user,setUser] = useState({});
    const [file,setFile] = useState(null);
    const [pImg,setPImg] = useState(null);
    const Id = useParams().userId;
    const {user : cuser,dispatch} = useContext(AuthContext)
    const [coverPic, setCoverPic] = useState(user.coverPic)
    const [profilePic,setProfilePic] = useState(user.profilePic)
    

const changeCoverHandler = async (e) =>{
    
    e.preventDefault();
    const newPost = cuser



    if(file)
     {
          const data = new FormData();
          const fileName = Date.now() + file.name;
       
          data.append("file",file,fileName);
          
          newPost.coverPic = fileName;

          try{
              await axios.post("/api/upload",data);
              dispatch({type: "coverPic",payload : fileName})
          } catch(err)
          {
               console.log(err);
          }
     }
     try{
        await axios.put(`/api/users/${cuser._id}`,newPost);
        
      }catch(err)
      {
           console.log(err);
      }
      setFile(null)
}


const changeProfileHandler = async (e) =>{
    
    e.preventDefault();
    const newPost = cuser



    if(pImg)
     {
          const data = new FormData();
          const fileName = Date.now() + pImg.name;
       
          data.append("file",pImg,fileName);
          
          newPost.profilePic = fileName;

          try{
              await axios.post("/api/upload",data);
              dispatch({type: "profilePic",payload : fileName})
          } catch(err)
          {
               console.log(err);
          }
     }
     try{
        await axios.put(`/api/users/${cuser._id}`,newPost);
        
      }catch(err)
      {
           console.log(err);
      }
      setPImg(null)
}



useEffect(()=>{
    const fetchUser = async () => {
        const res = await axios.get("/api/users?userId="+Id);
        setUser(res.data);
       }
       fetchUser();
},[Id])

useEffect(()=> {
   setCoverPic(cuser.coverPic)
},[cuser.coverPic]);

useEffect(()=> {
    setProfilePic(cuser.profilePic)
 },[cuser.profilePic]);

 const UploadBtn = () =>{
    return <button className="chngImgBtn" onClick={changeCoverHandler} >
        Upload
    </button>
 }

 const ProfileBtn = () =>{
    return <button className="chngPImgBtn" onClick={changeProfileHandler} >
        Upload
    </button>
 }
    return <>
        <Topbar />
        <div className="profile">
            <Sidebar />
            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                    { cuser._id===user._id && (
                        <button className="chngImg" >
                    <label htmlFor="file"  >
                        <CameraAlt  />
                        <input type="file" id="file" accept=".png,.jpeg,.jpg" style={{ display : "none" }} onChange={(e)=>{
                      setFile(e.target.files[0])}} />
                      </label>
                    </button>
                    ) }
                    {file ? <UploadBtn /> : null}
                        
                        <img src={ user._id===cuser._id && coverPic ? PF+coverPic : user.coverPic? PF+user.coverPic : PF+"person/noCover.png"} alt="cover" className="profileCoverImg" />
                        <img src={user._id===cuser._id && profilePic ? PF+profilePic : user.profilePic ? PF+user.profilePic : PF+'person/noAvatar.png'} alt="user" className="coverUser" />
                        { cuser._id===user._id && (
                        <div className="PimgContainer">
                        <button className="chngPImg" >
                    <label htmlFor="Pfile"  >
                        <CameraAlt  />
                        <input type="file" id="Pfile" accept=".png,.jpeg,.jpg" style={{ display : "none" }} onChange={(e)=>{
                      setPImg(e.target.files[0])}} />
                      </label>
                    </button>
                        </div>
                    ) }
                    {pImg ? <ProfileBtn /> : null}
                    </div>
                    <div className="user-name">
                        <h4 className="name">{user.username}</h4>
                        <span className="message">
                            {user.desc}
                        </span>
                    </div>
                </div>
                <div className="profileRightBottom">
                
                  <Feeds cuser={user}/>
                  <Rightbar user={user} />
                </div>
            </div>
        </div>
    </>
}

export default Profile;