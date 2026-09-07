import User from "../models/user.model.js";
import generateToken from "../config/token.js";

export const googleAuth = async(req, res) => {
    try {
        const { name , email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email });
        }
        let token = generateToken(user._id);
        if (!token) {
            return res.status(400).json({ message: 'Google token is required' });
        }
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 1 * 60 * 60 * 1000 });
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = (req, res) => {
    try { 
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}