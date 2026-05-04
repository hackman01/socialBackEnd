import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "../../utils/axios";
import { Search, Face, ExitToApp, Close, Home, Person, Notifications } from "@material-ui/icons";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PF = '/api/images/';

function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [drop, setDrop] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Debounced search
  const debouncedSearch = useCallback((text) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!text.trim()) {
      setDrop([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const list = await axios.post('/api/users/search', { text });
        setDrop(list.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [user._id]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(true);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearch('');
    setDrop([]);
    setShowDropdown(false);
    setIsSearching(false);
  };

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    window.location.href = '/login';
  };

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearch('');
    setDrop([]);
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Main Navbar */}
      <div className="flex h-16 w-full items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/[0.06] px-3 md:px-6 lg:px-8 shadow-lg shadow-black/20">

        {/* Left Side — Logo */}
        <div className="flex items-center min-w-[120px] md:min-w-[180px]">
          <Link to='/' className="no-underline flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-black text-lg leading-none">S</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors duration-300">
              Social
            </span>
          </Link>
        </div>

        {/* Center — Search */}
        <div className="flex-1 flex justify-center px-2 md:px-8 max-w-2xl mx-auto" ref={searchContainerRef}>
          <div className="relative w-full">
            <div className={`relative flex items-center w-full rounded-xl transition-all duration-300 ${searchFocused ? 'bg-white/[0.15] ring-2 ring-red-500/40 shadow-lg shadow-red-500/10' : 'bg-white/[0.08] hover:bg-white/[0.12]'}`}>
              <Search className="absolute left-3 text-white/40 pointer-events-none" style={{ fontSize: 20 }} />
              <input
                placeholder="Search for people..."
                value={search}
                onFocus={() => { setSearchFocused(true); if (search.trim()) setShowDropdown(true); }}
                onBlur={() => setSearchFocused(false)}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2.5 bg-transparent border-none text-sm text-white placeholder-white/40 focus:outline-none font-medium"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer transition-all duration-200"
                >
                  <Close style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 backdrop-blur-xl"
                style={{ animation: 'slideDown 0.2s ease-out' }}>

                {/* Searching indicator */}
                {isSearching && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'pulse 1s infinite 0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'pulse 1s infinite 200ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-red-400" style={{ animation: 'pulse 1s infinite 400ms' }}></span>
                    </div>
                    <span className="text-white/50 text-sm">Searching...</span>
                  </div>
                )}

                {/* Results */}
                {!isSearching && drop.length > 0 && (
                  <div className="max-h-[60vh] overflow-y-auto py-1">
                    <div className="px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/30">Results</span>
                    </div>
                    {drop.map(u => (
                      <Link
                        key={u._id}
                        to={"/profile/" + u._id}
                        className="block no-underline"
                        onClick={handleResultClick}
                      >
                        <div className="flex items-center gap-3 px-4 py-3 mx-1 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/[0.06] group">
                          <img
                            src={u.profilePic ? u.profilePic : PF + "person/noAvatar.png"}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover border-2 border-white/10 shadow-sm group-hover:border-red-500/40 transition-colors duration-200"
                          />
                          <div className="flex flex-col">
                            <span className="text-white font-medium text-sm group-hover:text-red-400 transition-colors">{u.username}</span>
                            <span className="text-white/30 text-xs">View profile</span>
                          </div>
                          <Person className="ml-auto text-white/20 group-hover:text-white/40 transition-colors" style={{ fontSize: 18 }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* No results */}
                {!isSearching && drop.length === 0 && search.trim() && (
                  <div className="flex flex-col items-center py-8 px-4">
                    <Search style={{ fontSize: 32, color: 'rgba(255,255,255,0.15)' }} />
                    <span className="text-white/40 text-sm mt-2">No users found for "{search}"</span>
                    <span className="text-white/20 text-xs mt-1">Try a different search term</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side — Navigation & Profile */}
        <div className="flex items-center gap-1 md:gap-2 min-w-[120px] md:min-w-[180px] justify-end">
          {/* Nav Links */}
          <Link to='/' className="no-underline hidden md:flex">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 border-none bg-transparent cursor-pointer group">
              <Home style={{ fontSize: 20 }} className="group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-medium hidden lg:block">Home</span>
            </button>
          </Link>

          <Link to={`/profile/${user._id}`} className="no-underline hidden md:flex">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200 border-none bg-transparent cursor-pointer group">
              <Person style={{ fontSize: 20 }} className="group-hover:text-red-400 transition-colors" />
              <span className="text-sm font-medium hidden lg:block">Profile</span>
            </button>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-white/10 mx-1"></div>

          {/* Profile Avatar & Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.08] transition-all duration-200 border-none bg-transparent cursor-pointer group"
            >
              <div className="relative">
                <img
                  alt="user"
                  src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"}
                  className="h-8 w-8 rounded-full object-cover border-2 border-white/20 group-hover:border-red-500/50 transition-all duration-300 shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <span className="hidden lg:block text-white/70 text-sm font-medium group-hover:text-white transition-colors max-w-[100px] truncate">
                {user.username}
              </span>
              <svg className={`hidden lg:block w-4 h-4 text-white/40 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                style={{ animation: 'slideDown 0.2s ease-out' }}>
                <div className="p-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePic ? user.profilePic : PF + "person/noAvatar.png"}
                      alt="user"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white/10"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm">{user.username}</span>
                      <span className="text-white/40 text-xs">{user.email || 'View your profile'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <Link
                    to={`/profile/${user._id}`}
                    className="no-underline"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <Face style={{ fontSize: 18 }} className="group-hover:text-red-400 transition-colors" />
                      </div>
                      <span className="text-sm font-medium">My Profile</span>
                    </div>
                  </Link>

                  <div className="my-1 mx-3 border-t border-white/[0.06]"></div>

                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer border-none bg-transparent group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <ExitToApp style={{ fontSize: 18 }} className="group-hover:text-red-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;