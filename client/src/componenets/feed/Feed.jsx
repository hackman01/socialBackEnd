import React, { useEffect, useContext, useState } from "react";
import { DeleteOutline, ThumbUp, ChatBubbleOutline } from '@material-ui/icons';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CommentSection from './CommentSection';

const PF = '/api/images/';

const Feed = ({ post, setPostRender }) => {
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const deleteHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.delete(`/api/posts/${post._id}`);
      if (res.status === 200) {
        setPostRender(Math.random());
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/users?userId=${post.userId}`);
      setUser(res.data);
    }
    fetchUser();
  }, [post.userId])

  const likeHandler = async () => {
    try {
      await axios.put(`/api/posts/${post._id}/like`);
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6 mb-8 transition-all duration-300 hover:shadow-lg">
      <Link to={"/profile/" + post.userId} className="no-underline text-inherit block mb-4">
        <div className="flex w-full justify-between items-center group">
          <div className="flex items-center">
            <img src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"} alt="user" className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-red-50 shadow-sm transition-transform group-hover:scale-105" />
            <span className="font-bold text-gray-800 text-lg">{user.username}</span>
          </div>

          {currentUser._id === post.userId && (
            <div className="p-2 rounded-full hover:bg-red-50 transition-colors" onClick={deleteHandler}>
              <DeleteOutline className="text-red-500 hover:text-red-700 cursor-pointer transition-colors" style={{ fontSize: 26 }} />
            </div>
          )}
        </div>
      </Link>
      
      <div className="w-full mb-4">
        <p className="text-gray-700 text-base leading-relaxed break-words whitespace-pre-wrap mb-4 px-1">{post.desc}</p>
        {post.img && (
          <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 mt-2">
            <img src={post.img} alt="pic" className="w-full max-h-[35rem] object-contain bg-gray-50/50 block" />
          </div>
        )}
      </div>
      
      {/* Action bar */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-1">
        <div className="flex items-center gap-2">
          {/* Like */}
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`} 
            onClick={likeHandler}
          >
            <ThumbUp className={`${isLiked ? 'scale-110' : ''} transition-transform`} style={{ fontSize: 20 }} />
            <span className="font-semibold text-sm">Like</span>
          </button>

          {/* Comment toggle */}
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${showComments ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setShowComments((prev) => !prev)}
          >
            <ChatBubbleOutline style={{ fontSize: 20 }} />
            <span className="font-semibold text-sm">Comment</span>
          </button>
        </div>

        <span className="text-gray-500 font-medium text-sm">
          Liked by <span className="text-gray-800 font-bold">{like}</span> {like === 1 ? 'person' : 'people'}
        </span>
      </div>

      {/* Collapsible comment section */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
}

export default Feed;