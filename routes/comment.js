const express = require('express');
const commentRouter = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// ─── POST /api/comments/:postId ─────────────────────────────────────────────
// Add a comment to a post (authenticated users only)
commentRouter.post('/:postId', verifyToken, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  try {
    const newComment = new Comment({
      postId: req.params.postId,
      userId: req.user.id,
      text: text.trim(),
    });

    const saved = await newComment.save();

    // Return comment with author info populated
    const author = await User.findById(req.user.id).select('username profilePic');
    return res.status(201).json({ ...saved._doc, author });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
});

// ─── GET /api/comments/:postId ───────────────────────────────────────────────
// Get all comments for a post with author details populated
commentRouter.get('/:postId', verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: 1,
    });

    // Populate author info for each comment
    const populated = await Promise.all(
      comments.map(async (c) => {
        const author = await User.findById(c.userId).select('username profilePic');
        return { ...c._doc, author };
      })
    );

    return res.status(200).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
});

// ─── DELETE /api/comments/:commentId ────────────────────────────────────────
// Delete a comment — only the comment author can do this
commentRouter.delete('/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own comments.' });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
});

module.exports = commentRouter;
