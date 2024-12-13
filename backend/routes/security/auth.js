const jwt = require('jsonwebtoken')
const secretKey = 'phyvauac.lk@2024';

function verifyToken(req, res, next){
    try{
        const token = req.headers.authorization

        if(!token){
            return res.status(403).send("Token not available");
        }

        jwt.verify(token.split(" ")[1], secretKey, (err, decoded)=>{
            if(err){
                return res.status(401).json({error_message:"Invalid token"})
            }
            next() 
        })
    }
    catch(error){
        return res.status(500).json({error_message:error.message})
    }
}

module.exports = { verifyToken }