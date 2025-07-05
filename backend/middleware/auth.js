const jwt = require('jsonwebtoken');

const auth = (req,res,next) =>{
    try{
        const token = req.header("Authorization");
        if(!token){
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded;
        next();
    }
    catch(err){
        console.error("Authentication error:", err);
        return res.status(401).json({ error: "Unauthorized access" });
    }
}

module.exports = auth;