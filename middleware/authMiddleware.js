import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';


// Authentication middleware to check if user is authenticated
const authenticateUser = async (req, res, next) => {
    try {
      // Extract token from request headers
      const token = req.headers.authorization;
  
      // Check if token exists
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if decoded token contains user ID
      if (!decoded.userId) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
  
      // Attach user ID to request object for further use
      req.userId = decoded.userId;
  
      // Proceed to next middleware
      next();
    } catch (error) {
      // Error handling
      console.error(error);
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };


  // Authorization middleware to check if user is admin
const authorizeAdmin = async (req, res, next) => {
  try {
    // Fetch user from database based on user ID attached to request object
    const user = await User.findById(req.userId);

    // Check if user exists and has admin role
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    // Proceed to next middleware
    next();
  } catch (error) {
    // Error handling
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  export { authenticateUser, authorizeAdmin }; 