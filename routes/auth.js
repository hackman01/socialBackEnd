const authRoute = require('express').Router();
const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');


// Helper to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


authRoute.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const user = new userModel(req.body);

    try {
        await user.save();
        const { password: pwd, updatedAt, ...userData } = user._doc;
        const token = generateToken(user._id);
        res.status(200).json({ token, ...userData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Registration failed.' });
    }

})

authRoute.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).json({ message: "Wrong password!" });
        }

        // Generate JWT token
        const token = generateToken(user._id);
        const { password, updatedAt, ...others } = user._doc;
        res.status(200).json({ token, ...others });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})


// GET /me — returns the currently authenticated user (for persistent sessions)
authRoute.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, updatedAt, ...userData } = user._doc;
        res.status(200).json(userData);
    } catch (err) {
        console.error('Get /me error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = authRoute;