import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from '../../utils/axios';
import { RssFeed } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

import { Link } from 'react-router-dom';

const PF = '/api/images/';

const CloseFriend = ({ user }) => {
  return (
    <Link to={`/profile/${user._id}`} className="no-underline text-black block">
      <div className="flex items-center p-2 mb-3 cursor-pointer rounded-lg hover:bg-red-50 transition-colors duration-200">
        <img src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"} alt="user" className="h-10 w-10 rounded-full object-cover mr-4 border-2 border-red-100 shadow-sm" />
        <span className="font-medium text-gray-800">{user.username}</span>
      </div>
    </Link>
  );
}

function Sidebar() {
  const { user: cuser } = useContext(AuthContext);

  const [Users, setUsers] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await axios.get(`/api/users/followers/${cuser._id}`);
        setUsers(friends.data);
        setLoad(false);
      } catch (err) {
        console.log(err);
      }
    }
    fetchFriends();
  }, [cuser._id]);

  return (
    <div className="hidden md:block flex-[1.5] lg:flex-[1.3] h-[calc(100vh-64px)] overflow-y-auto bg-gray-50/50 border-r border-gray-200 scrollbar-hide sticky top-16">
      <div className="p-5 lg:p-7">
        <ul className="m-0 p-0 list-none">
          <Link to="/" className="no-underline text-black block">
            <li className="flex items-center cursor-pointer p-3 mb-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 font-semibold group">
              <RssFeed className="mr-4 text-red-600 group-hover:scale-110 transition-transform duration-300" />
              <span>Feed</span>
            </li>
          </Link>
        </ul>
        
        <hr className="my-6 border-gray-200" />
        <h3 className="mb-4 text-gray-500 uppercase tracking-wider text-xs font-bold pl-2">Followers</h3>
        
        <div className="m-0">
          {load ? (
            <div className="flex justify-center mt-10">
              <CircularProgress style={{ color: '#ac300a' }} />
            </div>
          ) : (
            Users.map(u => {
              return <CloseFriend key={u._id} user={u} />
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;