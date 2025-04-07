const jwt = require("jsonwebtoken");

// add this in later, It will be annoying todo as you will need to update everything isn routers that needs it
const authMiddleware = async (requestAnimationFrame, res, next) =>{
    try {

        const authHeader = requestAnimationFrame.header("Authorization");
        
        //check token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).send({error:"No token"});
        }
        //check if token valid
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decodedToken.userId
        // now when you want id, use req.userId
    } catch (error) {
        res.status(401).send({error:"Invalid token"})
    }
}
export default authMiddleware;