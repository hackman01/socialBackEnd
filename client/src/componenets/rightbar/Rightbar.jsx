import { React, useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import { Users } from '../../pages/dummyData.js';
import axios from '../../utils/axios';
import { CircularProgress } from '@material-ui/core';

//here cuser is logined user and user is the general user

const PF = '/api/images/';

const Friend = ({ user }) => {
  return (
    <Link to={"/profile/" + user._id} className="no-underline text-black m-2">
      <div className="flex flex-col items-center text-center text-sm p-2 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-sm">
        <img src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"} alt="friend" className="h-16 w-16 rounded-xl object-cover mb-2 border-2 border-gray-100 shadow-sm" />
        <span className="font-medium text-gray-700">{user.username}</span>
      </div>
    </Link>
  );
}

function Rightbar({ user }) {

  const ProfileRightbar = ({ user }) => {

    const [friends, setFriends] = useState([]);
    const { user: cuser, dispatch } = useContext(AuthContext);
    const [isFollowed, setIsFollowed] = useState(false);
    const [prompt, setPrompt] = useState(false);
    const [age, setAge] = useState();
    const [relationship, setRelationship] = useState();
    const [workat, setWorkat] = useState();
    const [load, setLoad] = useState(true);

    const handleClick = async () => {
      try {
        if (isFollowed) {
          await axios.put(`/api/users/${user._id}/unfollow`);
          dispatch({ type: "UNFOLLOW", payload: user._id });
        } else {
          await axios.put(`/api/users/${user._id}/follow`);
          dispatch({ type: "FOLLOW", payload: user._id });
        }
      } catch (err) {
        console.log(err);
      }
      setIsFollowed(!isFollowed);
    }

    useEffect(() => {
      const fetchFriends = async () => {
        try {
          const friend = await axios.get('/api/users/friends/' + user._id);
          setFriends(friend.data);
          setLoad(false);
        } catch (err) {
          console.log(err);
        }
      };
      fetchFriends();
    }, [user._id]);

    useEffect(() => {
      setIsFollowed(cuser.followings?.includes(user._id));
    }, [user._id, cuser.followings]);

    useEffect(() => {
      setAge(cuser.age);
      setRelationship(cuser.relationship);
      setWorkat(cuser.workat);
    }, [cuser.age, cuser.relationship, cuser.workat]);

    const Follow = () => {
      return (
        <button 
          className={`flex items-center justify-center mt-6 w-full py-2.5 rounded-lg font-semibold transition-all duration-300 border-none cursor-pointer shadow-sm ${isFollowed ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md'}`} 
          onClick={handleClick}
        >
          {isFollowed ? <span>Unfollow</span> : <span>Follow</span>}
        </button>
      );
    }

    const submitInfoHandler = async (e) => {
      e.preventDefault();
      const newPost = {
        ...cuser,
        age: age,
        relationship: relationship,
        workat: workat
      }

      try {
        await axios.put(`/api/users/${cuser._id}`, newPost);
        dispatch({ type: "INFOAGE", payload: age });
        dispatch({ type: "INFOREL", payload: relationship });
        dispatch({ type: "INFOWORK", payload: workat });
      } catch (err) {
        console.log(err);
      }
      setPrompt(!prompt);
    }

    const editInfoHandler = (e) => {
      e.preventDefault();
      setPrompt(!prompt);
    }

    return (
      <div className="hidden lg:block flex-[3.5] h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide sticky top-16 right-0 bg-white border-l border-gray-100 shadow-sm p-6">
        <div className="flex flex-col h-full">
          {cuser._id !== user._id && <Follow />}
          
          <div className="mt-8 mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
            <h4 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide text-sm border-b border-gray-200 pb-2">User Info</h4>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm">Age</span>
                <span className="font-semibold text-gray-800">{cuser._id === user._id ? cuser.age : user.age}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm">Me in a word</span>
                <span className="font-semibold text-gray-800">{cuser._id === user._id ? cuser.relationship : user.relationship}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500 text-sm">Work At</span>
                <span className="font-semibold text-gray-800">{cuser._id === user._id ? cuser.workat : user.workat}</span>
              </div>
            </div>
            
            {user._id === cuser._id && (
              <button 
                className="mt-5 w-full py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm cursor-pointer" 
                onClick={editInfoHandler}
              >
                Edit Info
              </button>
            )}
            
            {prompt && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in-down">
                <form onSubmit={submitInfoHandler} className="flex flex-col gap-3">
                  <input type="text" placeholder="Age" className="p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all" value={age || ''} onChange={(e) => { setAge(e.target.value) }} />
                  <input type="text" placeholder="Me in a word" className="p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all" value={relationship || ''} onChange={(e) => { setRelationship(e.target.value) }} />
                  <input type="text" placeholder="Work at" className="p-2 border border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all" value={workat || ''} onChange={(e) => { setWorkat(e.target.value) }} />
                  <button type="submit" className="mt-2 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors cursor-pointer border-none shadow-sm">Update</button>
                </form>
              </div>
            )}
          </div>

          <h4 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide text-sm">Followings</h4>
          <div className="flex flex-wrap gap-2">
            {load ? (
              <div className="flex w-full justify-center p-8">
                <CircularProgress style={{ color: '#ac300a' }} />
              </div>
            ) : (
              friends.map(friend => {
                return <Friend key={friend._id} user={friend} />
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  const HomeRightbar = ({ Users }) => {
    const [joke, setJoke] = useState("Loading...");
    
    useEffect(() => {
      const callJoke = async () => {
        fetch('https://official-joke-api.appspot.com/random_joke')
          .then(response => response.json())
          .then(data => setJoke(data.setup + " ....... " + data.punchline)).catch((err) => {
            console.log(err);
          });
      }
      callJoke();
    }, []);

    return (
      <div className="hidden lg:block flex-[3.5] h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide sticky top-16 right-0 border-l border-gray-100 bg-gray-50/30">
        <div className="p-6">
          <div className="flex justify-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] cursor-pointer">
            <img src="/assets/ad.png" alt="batman" className="h-64 w-64 object-contain rounded-xl" />
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 transition-all duration-300 group-hover:w-2"></div>
            <h4 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
              <span className="mr-2">🎭</span> Joke for You
            </h4>
            <div className="text-gray-600 leading-relaxed italic text-base">
              "{joke}"
            </div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <ProfileRightbar user={user} /> : <HomeRightbar Users={Users} />
}

export default Rightbar;