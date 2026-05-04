const userRoute = require('express').Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const verifyToken = require('../middleware/auth');

//to update user info
userRoute.put('/:id', verifyToken, async (req, res) => {

    if (req.params.id === req.user.id || req.body.isAdmin) {

        try {
            await userModel.findByIdAndUpdate(req.params.id, { $set: req.body });
            return res.status(200).json({ message: "Account has been updated!" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        }

    } else {
        return res.status(403).json({ message: "You can update only your account!" });
    }

})

userRoute.delete('/:id', verifyToken, async (req, res) => {

    if (req.params.id === req.user.id || req.body.isAdmin) {

        try {
            await userModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Account has been deleted!" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "You can delete only your account!" });
        }

    } else {
        return res.status(403).json({ message: "You can delete only your account!" });
    }

})


userRoute.get('/', verifyToken, async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {

        const user = userId ? await userModel.findById(userId) : await userModel.find({ username: username });
        const { password, updatedAt, ...other } = user._doc; //another form of destructuring
        return res.status(200).json(other);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!" });
    }

})


userRoute.put('/:id/follow', verifyToken, async (req, res) => {

    if (req.user.id !== req.params.id) {
        try {

            const user = await userModel.findById(req.params.id);
            const currentUser = await userModel.findById(req.user.id);
            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } })
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                return res.status(200).json({ message: "User has been followed!" });
            }
            else {
                return res.status(403).json({ message: "You already follow this user!" });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong!" });

        }
    }
    else {
        return res.status(403).json({ message: "You cant follow yourself!" });
    }

})



userRoute.get('/friends/:userId', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId)
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return userModel.findById(friendId);
            })
        )
        let friendsList = [];
        friends.map((friend) => {
            const { _id, username, profilePic } = friend
            friendsList.push({ _id, username, profilePic });
        })
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json(err)
    }
})


userRoute.get('/followers/:userId', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId)
        const friends = await Promise.all(
            user.followers.map((friendId) => {
                return userModel.findById(friendId);
            })
        )
        let friendsList = [];
        friends.map((friend) => {
            const { _id, username, profilePic } = friend
            friendsList.push({ _id, username, profilePic });
        })
        res.status(200).json(friendsList);
    } catch (err) {
        res.status(500).json(err)
    }
})


userRoute.put('/:id/unfollow', verifyToken, async (req, res) => {

    if (req.user.id !== req.params.id) {
        try {

            const user = await userModel.findById(req.params.id);
            const currentUser = await userModel.findById(req.user.id);
            if (user.followers.includes(req.user.id)) {
                await user.updateOne({ $pull: { followers: req.user.id } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                return res.status(200).json({ message: "User has been unfollowed!" });
            }
            else {
                return res.status(403).json({ message: "You dont follow this user!" });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong!" });

        }
    }


})

userRoute.post('/search', verifyToken, async (req, res) => {

    const { text } = req.body;
    const userId = req.user.id;
    try {

        const users = await userModel.find();
        let userList = [];
        users.map(user => {
            if (user.username.toLowerCase().includes(text.toLowerCase()) && user._id.toString() !== userId) {
                const { _id, username, profilePic } = user;
                userList.push({ _id, username, profilePic });
            }
        })
        return res.status(200).json(userList)

    } catch (err) {
        console.log(err);
        return res.status(500).json(err)
    }

})

// userRoute.get('/profile/');


module.exports = userRoute;