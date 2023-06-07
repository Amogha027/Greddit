const Greddit = require('../models/greddit');

module.exports.all_greddit = async (req, res) => {
    const moderator = req.username;
    const greddits = await Greddit.find()

    if (greddits) {
        res.send({ status: 'done', greddits, moderator: moderator });
    } else {
        res.status(400).send({ status: 'failed' });
    }
}

module.exports.join_greddit = async (req, res) => {
    // console.log(req.body);

    const greddit = await Greddit.findByIdAndUpdate({ _id: req.body.id });
    const arr = greddit.left.filter((obj) => {
        if (obj.name === req.body.name)
            return obj;
    });

    if (arr.length) {
        res.send({ verdict: 'not allowed' });
    } else if (greddit.waiting.includes(req.body.name)) {
        res.send({ verdict: 'requested earlier' });
    } else if (greddit.blocked.includes(req.body.name)) {
        res.send({ verdict: 'you are blocked' });
    } else {
        await Greddit.findByIdAndUpdate({ _id: req.body.id }, {
            $push: {
                waiting: req.body.name
            }
        })
        res.send({ verdict: 'request sent' });
    }
}

module.exports.leave_greddit = async (req, res) => {
    // console.log(req.body);

    await Greddit.findByIdAndUpdate({ _id: req.body.id }, {
        $push: {
            left: {
                name: req.body.name,
                day: req.body.day
            }
        },
        $pull: {
            followers: req.body.name
        }
    })
}