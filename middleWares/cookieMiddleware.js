const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'thisismysecretkeyforjsonwebtoken';

const cookieMiddleWare = ( req ,res ,next) =>{
    
    const token = req.cookies.jwt_token;

    const isTokenValid = jwt.verify(token , JWT_SECRET_KEY);
    
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

module.exports = cookieMiddleWare;