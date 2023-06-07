const jwt = require('jsonwebtoken');
require('dotenv').config()

const requireAuth = (req, res, next) => {
    const token = req.body.accessToken;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                // console.log(err.message);
                res.send({ verdict: 'failed' });
            } else {
                // console.log(decodedToken);
                req.username = decodedToken.name;
                next();
            }
        });
    }
    else {
        res.send({ verdict: 'failed' });
    }
}

module.exports = { requireAuth };