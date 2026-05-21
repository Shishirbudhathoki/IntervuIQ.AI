import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY; 
    if (!secretKey) {
        throw new Error('JWT secret key is not defined in environment variables');
    }
    const token = jwt.sign({ userId }, secretKey, { expiresIn : '1h' });
    return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate JWT token');
    }
}

export default generateToken;
