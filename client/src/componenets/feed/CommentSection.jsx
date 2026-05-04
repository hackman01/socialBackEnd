import React, { useState, useEffect, useContext, useRef } from 'react';
import { DeleteOutline, Send } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';
import axios from '../../utils/axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PF = '/api/images/';

function CommentSection({ postId }) {
  const { user: currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const inputRef = useRef();

  // Fetch comments when section mounts
  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${postId}`);
        if (!cancelled) setComments(res.data);
      } catch (err) {
        if (!cancelled) toast.error('Failed to load comments. Please refresh.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchComments();
    return () => { cancelled = true; };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/comments/${postId}`, { text });
      setComments((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    setDeletingId(commentId);
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 px-1">
      {/* Comment List */}
      <div className="max-h-72 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center py-4">
            <CircularProgress size={22} style={{ color: '#dc2626' }} />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-3 italic">
            No comments yet — be the first!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="group flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50/40 transition-colors duration-200"
            >
              {/* Avatar */}
              <Link to={`/profile/${c.userId}`} className="flex-shrink-0">
                <img
                  src={
                    c.author?.profilePic
                      ? c.author.profilePic
                      : PF + 'person/noAvatar.png'
                  }
                  alt={c.author?.username}
                  className="h-8 w-8 rounded-full object-cover border border-red-100 shadow-sm"
                />
              </Link>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Link
                    to={`/profile/${c.userId}`}
                    className="no-underline text-gray-800 font-semibold text-sm hover:text-red-600 transition-colors"
                  >
                    {c.author?.username ?? 'Unknown'}
                  </Link>
                  <span className="text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-snug break-words">
                  {c.text}
                </p>
              </div>

              {/* Delete — only own comments */}
              {currentUser._id === c.userId && (
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deletingId === c._id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 disabled:opacity-50"
                  title="Delete comment"
                >
                  {deletingId === c._id ? (
                    <CircularProgress size={14} style={{ color: '#dc2626' }} />
                  ) : (
                    <DeleteOutline style={{ fontSize: 16 }} />
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 mt-4"
      >
        <img
          src={
            currentUser.profilePic
              ? currentUser.profilePic
              : PF + 'person/noAvatar.png'
          }
          alt="me"
          className="h-8 w-8 rounded-full object-cover border border-red-100 shadow-sm flex-shrink-0"
        />
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment…"
            maxLength={500}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            title="Post comment"
          >
            {submitting ? (
              <CircularProgress size={16} style={{ color: '#dc2626' }} />
            ) : (
              <Send style={{ fontSize: 18 }} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;
