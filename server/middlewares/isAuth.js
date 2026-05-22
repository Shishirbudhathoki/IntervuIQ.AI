import jwt from 'jsonwebtoken';


const isAuth = async (req, res, next) => {
    try {
        let {token} = req.cookies;
        if (!token) {
            return res.status(400).json({ message: 'Unauthorized token required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(400).json({ message: 'User doesnot have a valid token' });
        }
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default isAuth;