import React, { useContext, useRef, useState } from "react";
import { Cancel, Photo } from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';

const PF = '/api/images/';

function Post({ reRender }) {
  const desc = useRef();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [fileImg, setFileImg] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newPost = {
      desc: desc.current.value,
    }

    if (fileImg) {
      const data = new FormData();
      const fileName = Date.now() + fileImg.name;
      data.append("file", fileImg, fileName);
      newPost.img = fileName;

      try {
        const img = await axios.post("/api/upload", data);
        newPost.img = img.data.url;
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("/api/posts", newPost);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    reRender(Math.random());
    desc.current.value = "";
    setFileImg(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Link to={`/profile/${user._id}`} className="no-underline text-inherit">
          <img src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"} alt="user" className="h-11 w-11 rounded-full object-cover mr-4 border-2 border-red-50 shadow-sm transition-transform hover:scale-105" />
        </Link>
        <span className="font-bold text-gray-800 text-lg">{user.username}</span>
      </div>

      <form onSubmit={submitHandler} className="w-full">
        <div className="w-full">
          <textarea
            className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all text-gray-700 text-base shadow-inner bg-gray-50/50"
            placeholder="What's on your mind?"
            ref={desc}
          ></textarea>
        </div>
        
        {fileImg && (
          <div className="relative p-2 md:p-4 mt-2 bg-gray-50 rounded-xl border border-gray-100">
            <img src={URL.createObjectURL(fileImg)} alt="" className="w-full h-auto max-h-[40vh] object-contain rounded-lg" />
            <Cancel className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-800 bg-white rounded-full cursor-pointer hover:text-red-600 shadow-md transition-colors" onClick={() => { setFileImg(null) }} />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <label htmlFor="fileImg" className="flex items-center cursor-pointer group px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <Photo className="text-red-500 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-gray-600 font-medium text-sm">Photo or Video</span>
              <input type="file" id="fileImg" accept=".png,.jpeg,.jpg" style={{ display: "none" }} onChange={(e) => {
                setFileImg(e.target.files[0])
              }} />
            </label>
          </div>
          <div>
            <button 
              className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-300 focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Posting..." : "Share"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Post;