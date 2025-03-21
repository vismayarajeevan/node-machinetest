
const jwt = require('jsonwebtoken');

const verifyUserToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(403).json({ message: "Token missing from header" });
        }


        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
            console.log("JWT_SECRET is "+ process.env.JWT_SECRET_KEY,);
            if (error) {
                console.log("JWT_SECRET is error is  "+ process.env.JWT_SECRET_KEY,);
                console.error("JWT verification error:", error);
                return res.status(403).json({ message: "Invalid token", error });
            }
            console.log("JWT_SECRET is "+ process.env.JWT_SECRET_KEY,);

            req.user = decoded;
            console.log("Decoded JWT (User):", req.user);  
            next();
        });
    } else {
        return res.status(401).json({ message: "No token provided or incorrect format" });
    }
};



const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log("Authorization Header:", authHeader); 

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]; 

        if (!token) {
            console.log("Token missing from header");  
            return res.status(403).json({ message: "Token missing from header" });
        }


        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
          
            if (error) {
               
                console.error("JWT verification error:", error); 
                return res.status(403).json({ message: "Invalid token", error });
            }

            console.log("Decoded JWT:", decoded.isAdmin);

            if (decoded.isAdmin === true) {
                console.log("Admin check passed. User is an admin."); 
                req.user = decoded; 
                console.log("Decoded JWT (Admin):", req.user); 
                next(); 
            } else {
                console.log("Admin check failed. User is not an admin.");
                return res.status(403).json({ message: "You are not an admin!" });
            }
        });
    } else {
        console.log("Authorization header is missing or incorrect format");  // Log when Authorization header is missing or incorrect
        return res.status(401).json({ message: "No token provided or incorrect format" });
    }
};


module.exports = { verifyUserToken, verifyAdminToken };
