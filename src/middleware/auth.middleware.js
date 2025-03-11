import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // ✅ Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }

        // ✅ Extract the token (removing 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];

        // ✅ Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Add user data to req.user
        req.user = { userId: decoded?.id };

        next(); // Pass control to the next middleware
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
    }
};

export { authMiddleware };
