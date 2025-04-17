const jwt = require("jsonwebtoken");

// to add this in change the routes to be like router.get('/protectedRoute', authMiddleware, async (req, res) => {
const authMiddleware = async (req, res, next) =>{
    try {

        const authHeader = req.header("Authorization");
        
        //check token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).send({error:"No token"});
        }
        //check if token valid
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decodedToken.userId;
        next();
        // now when you want id, use req.userId
    } catch (error) {
        res.status(401).send({error:"Invalid token"})
    }
}
module.exports=authMiddleware;