import React, { useState, useEffect, useContext } from "react";
import Topbar from "../../componenets/topbar/Topbar";
import Sidebar from "../../componenets/sidebar/Sidebar";
import Feeds from "../../componenets/feed/Feeds";
import Rightbar from "../../componenets/rightbar/Rightbar";
import axios from '../../utils/axios';
import { useParams } from 'react-router';
import { AuthContext } from "../../context/AuthContext";

const PF = '/api/images/';

function Profile() {
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [pImg, setPImg] = useState(null);
  const Id = useParams().userId;
  const { user: cuser, dispatch } = useContext(AuthContext);
  const [coverPic, setCoverPic] = useState(user.coverPic);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [loading, setLoading] = useState(false);

  const changeCoverHandler = async (e) => {
    e.preventDefault();
    const newPost = cuser;

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;

      data.append("file", file, fileName);

      try {
        setLoading(true);
        const img = await axios.post("/api/upload", data);
        newPost.coverPic = img.data.url;
        dispatch({ type: "coverPic", payload: img.data.url });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    try {
      await axios.put(`/api/users/${cuser._id}`, newPost);
    } catch (err) {
      console.log(err);
    }
    setFile(null);
  }

  const changeProfileHandler = async (e) => {
    e.preventDefault();
    const newPost = cuser;

    if (pImg) {
      const data = new FormData();
      const fileName = Date.now() + pImg.name;

      data.append("file", pImg, fileName);

      try {
        setLoading(true);
        const img = await axios.post("/api/upload", data);
        newPost.profilePic = img.data.url;
        dispatch({ type: "profilePic", payload: img.data.url });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    try {
      await axios.put(`/api/users/${cuser._id}`, newPost);
    } catch (err) {
      console.log(err);
    }
    setPImg(null);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/api/users?userId=" + Id);
      setUser(res.data);
      setCoverPic(res.data.coverPic);
      setProfilePic(res.data.profilePic);
    }
    fetchUser();
  }, [Id]);

  useEffect(() => {
    setCoverPic(cuser.coverPic);
  }, [cuser.coverPic]);

  useEffect(() => {
    setProfilePic(cuser.profilePic);
  }, [cuser.profilePic]);

  const UploadBtn = () => {
    return (
      <button 
        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors z-10 border-none cursor-pointer" 
        onClick={changeCoverHandler}
      >
        {loading && file ? "Uploading..." : "Save Cover Pic"}
      </button>
    );
  }

  const ProfileBtn = () => {
    return (
      <button 
        className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded shadow transition-colors cursor-pointer border-none mx-auto block" 
        onClick={changeProfileHandler}
      >
        {loading && pImg ? "Uploading..." : "Save Profile Pic"}
      </button>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Topbar />
      <div className="flex w-full max-w-[1600px] mx-auto overflow-hidden">
        <Sidebar />
        
        <div className="flex-[8.5] w-full h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide">
          <div className="flex flex-col w-full">
            
            {/* Profile Cover Area */}
            <div className="relative w-full">
              <div className="relative h-[200px] md:h-[320px] w-full rounded-b-xl overflow-hidden shadow-sm group">
                <img 
                  src={coverPic ? coverPic : PF + "person/noCover.png"} 
                  alt="cover" 
                  className="w-full h-full object-cover" 
                />
                
                {cuser._id === user._id && (
                  <label htmlFor="file" className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center">
                    <span className="font-medium">Change Cover</span>
                    <input 
                      type="file" 
                      id="file" 
                      accept=".png,.jpeg,.jpg" 
                      className="hidden" 
                      onChange={(e) => { setFile(e.target.files[0]) }} 
                    />
                  </label>
                )}
                {file ? <UploadBtn /> : null}
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[60px] md:-bottom-[80px] flex flex-col items-center">
                <div className="relative group">
                  <img 
                    src={profilePic ? profilePic : PF + 'person/noAvatar.png'} 
                    alt="user" 
                    className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white object-cover shadow-lg bg-white" 
                  />
                  
                  {!pImg && cuser._id === user._id && (
                    <label htmlFor="Pfile" className="absolute inset-0 bg-black/30 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-sm backdrop-blur-[2px]">
                      <span>Change</span>
                      <input 
                        type="file" 
                        id="Pfile" 
                        accept=".png,.jpeg,.jpg" 
                        className="hidden" 
                        onChange={(e) => { setPImg(e.target.files[0]) }} 
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex flex-col items-center mt-[70px] md:mt-[90px] mb-8">
              {pImg ? <ProfileBtn /> : null}
              <h4 className="text-2xl md:text-3xl font-extrabold text-gray-800 mt-2 mb-1">{user.username}</h4>
              <span className="text-gray-500 font-medium text-base md:text-lg">
                {user.desc || "Hello, I am using Social"}
              </span>
            </div>
            
            {/* Main Content: Feeds & Rightbar */}
            <div className="flex flex-col lg:flex-row w-full px-2 md:px-4 gap-4">
              <div className="flex-[6] lg:flex-[5.5]">
                <Feeds cuser={user} />
              </div>
              <div className="flex-[4] lg:flex-[3.5]">
                <Rightbar user={user} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;