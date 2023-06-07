const User = require('../models/user');

module.exports.get_profile = async (req, res) => {
    const user = await User.findOne({ userName: req.username });
    res.send({ verdict: 'done', user });
}

module.exports.profile_update = async (req, res) => {
    const user = await User.findOneAndUpdate({ userName: req.body.userName }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        contact: req.body.contact,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password
    });

    res.send({ verdict: 'done' });
}

module.exports.update_followers = async (req, res) => {
    console.log(req.body);
    await User.findOneAndUpdate({ userName: req.body.name1 }, {
        $pull: {
            followers: req.body.name2
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })
        
    await User.findOneAndUpdate({ userName: req.body.name2 }, {
        $pull: {
            following: req.body.name1
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })
}

module.exports.update_following = async (req, res) => {
    // console.log(req.body);

    await User.findOneAndUpdate({ userName: req.body.name1 }, {
        $pull: {
            following: req.body.name2
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })

    await User.findOneAndUpdate({ userName: req.body.name2 }, {
        $pull: {
            followers: req.body.name1
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })
}