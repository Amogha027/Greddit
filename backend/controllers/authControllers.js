const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
    return jwt.sign({ name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: maxAge });
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.find({ userName: req.body.userName });
    if (user.length) {
        // console.log(user);
        res.send({ verdict: 'failed', msg: 'user already exists'})
    } else {
        await User.create(req.body)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                // console.log(err.message);
                res.send({ verdict: 'failed', msg: err.message });
            })
    }
}

module.exports.login_post = async (req, res) => {
    // console.log(req.body);
    
    const user = await User.findOne({ userName: req.body.userName });
    if (user) {
        // compare hashed password
        const auth = await bcrypt.compare(req.body.password, user.password);
        if (auth) {
            const token = createToken(user.userName);
            res.send({ status: 'done', token: token });
        } else {
            res.send({ stats: 'failed', errs: 'incorrect password'});
        }
    } else {
        res.send({ stats: 'failed', errs: 'incorrect username'});
    }
}