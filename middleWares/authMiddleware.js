const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'thisismysecretkeyforjsonwebtoken';

const authMiddleWare = ( req ,res ,next) =>{
    
    //extract token from req headers.
    const token = req.headers.authorization.split(" ")[1];  //Bearer abcxyz

    //verify token using secret key.
    const isTokenValid =jwt.verify(token , JWT_SECRET_KEY);

    //if token is valid.
    if (isTokenValid)
    {
        next();    
    } 
    else 
    {
        res.json({
            status : 0,
            message : 'Invalid Access',
            data : null
        })
    }
}

module.exports = authMiddleWare;