const Greddit = require('../models/greddit');
const Report = require('../models/reports');
const Post = require('../models/posts');
const User = require('../models/user');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gredditdass@gmail.com',
        pass: 'xjpxsbpnuxqzlqqy'
    }
});

module.exports.new_greddit = async (req, res) => {
    // console.log(req.body);

    try {
        const name = req.body.name;
        const temp = await Greddit.findOne({ name: name });
        if (temp) {
            res.send({verdict: 'failed', msg: 'already exists'});
        } else {
            const greddit = new Greddit(req.body);

            greddit.save()
                .then((result) => res.send({verdict: 'done', result}))
                .catch((err) => res.status(400).send(err));
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports.sub_greddit = async (req, res) => {
    // console.log(req.body);

    const moderator = req.username;
    const greddits = await Greddit.find({ moderator: moderator });

    res.send({ verdict: 'done', greddits, moderator: moderator });
}

module.exports.delete_greddit = async (req, res) => {
    const gname = req.body.name;
    
    // delete greddit 
    await Greddit.findOneAndDelete({ name: gname })
        .catch((err) => res.send(err));
    
    // find and delete posts
    const posts = await Post.find({ gname: gname })
        .catch((err) => res.send(err));

    posts.map(async (obj) => {
        await Post.findByIdAndDelete({ _id: obj._id });
    })

    // find and delete reports
    const reports = await Report.find({ gname: gname })
        .catch((err) => res.send(err));

    reports.map(async (obj) => {
        await Report.findByIdAndDelete({ _id: obj._id });
    })
}

module.exports.join_greddit = async (req, res) => {
    // console.log(req.body);

    await Greddit.findByIdAndUpdate({ _id: req.body.id }, {
        $pull: {
            waiting: req.body.name
        },
        $push: {
            followers: req.body.name,
            joined: {
                name: req.body.name,
                day: req.body.day
            }
        }
    })
}

module.exports.reject_greddit = async (req, res) => {
    // console.log(req.body);

    await Greddit.findByIdAndUpdate({ _id: req.body.id }, {
        $pull: {
            waiting: req.body.name
        },
        $push: {
            rejected: {
                name: req.body.name,
                day: req.body.day
            }
        }
    })
}

module.exports.get_reports = async (req, res) => {
    // console.log(req.body);
    const date = new Date;
    // console.log(date);

    var toDelete = [];
    const reports = await Report.find({ gname: req.body.name });
    const arr = reports.filter((obj) => {
        var diff_in_time = date.getTime() - obj.createdAt.getTime();
        var diff_in_days = diff_in_time / (1000 * 3600 * 24);
        if (Math.floor(diff_in_days) < 10) {
            return obj;
        } else {
            toDelete.push(obj._id);
        }
    })
    for (let i = 0; i < toDelete.length; i++) {
        await Report.findByIdAndDelete({ _id: toDelete[i] });
    }
    res.send({ reports: arr });
}

module.exports.ignore_report = async (req, res) => {
    // console.log(req.body);

    const report = await Report.findById({ _id: req.body.id });
    if (report.status === 'ignored') {
        res.send({ verdict: 'already ignored'});
    } else {
        await Report.findByIdAndUpdate({ _id: req.body.id }, {
            status: 'ignored'
        })
            .catch((err) => {
                res.status(400).send(err);
            })
        const post = await Post.findById({ _id: report.pid });
        
        // email part
        const user = await User.findOne({ userName: report.reported_by });
        // console.log(user.email);
        var mailoptions = {
            from: 'gredditdass@gmail.com',
            to: user.email,
            subject: 'Ignoring your report',
            text: 'Your report on ' + report.reported_to + ' based on the post (text: ' + post.description + ' ) in the subgreddit ' + report.gname + ' has been ignored by the moderator.'
        };

        transporter.sendMail(mailoptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

module.exports.delete_report = async (req, res) => {
    // console.log(req.body);

    const report = await Report.findByIdAndDelete({ _id: req.body.id })
        .catch((err) => {
            res.status(400).send(err);
        })

    const post = await Post.findByIdAndDelete({ _id: req.body.pid })
        .catch((err) => {
            res.status(400).send(err);
        })

    // email part
    // send it to the reporter
    const user = await User.findOne({ userName: report.reported_by });
    // console.log(user.email);
    var mailoptions = {
        from: 'gredditdass@gmail.com',
        to: user.email,
        subject: 'Deleting your report',
        text: 'Your report on ' + report.reported_to + ' based on the post (text: ' + post.description + ' ) in the subgreddit ' + report.gname + ' has been deleted by the moderator.'
    };

    transporter.sendMail(mailoptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // send it to the reported user
    const user1 = await User.findOne({ userName: report.reported_to });
    var mailoptions1 = {
        from: 'gredditdass@gmail.com',
        to: user1.email,
        subject: 'Deleting your post',
        text: 'Your post (text: ' + post.description + ' ) was reported and the moderator has decided to delete your post in the subgreddit ' + report.gname
    }

    transporter.sendMail(mailoptions1, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.block_report = async (req, res) => {
    // console.log(req.body);

    const report = await Report.findByIdAndUpdate({ _id: req.body.id }, {
        status: 'blocked'
    })
        .catch((err) => {
            res.status(400).send(err);
        })

    const post = await Post.findByIdAndUpdate({ _id: req.body.pid }, {
        status: 'passive'
    })
        .catch((err) => {
            res.status(400).send(err);
        })

    await Greddit.findOneAndUpdate({ name: req.body.gname }, {
        $pull: {
            followers: req.body.name
        },
        $push: {
            blocked: req.body.name
        }
    })
        .catch((err) => {
            res.status(400).send(err);
        })

    // email part
    // console.log(report);
    const user = await User.findOne({ userName: report.reported_by });
    // console.log(user.email);
    var mailoptions = {
        from: 'gredditdass@gmail.com',
        to: user.email,
        subject: 'Blocking the user',
        text: 'Your report on ' + report.reported_to + ' based on the post (text: ' + post.description + ' ) in the subgreddit ' + report.gname + ' has been processed and the reported user is blocked by the moderator.'
    };

    transporter.sendMail(mailoptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    // send it to the reported user
    const user1 = await User.findOne({ userName: report.reported_to });
    var mailoptions1 = {
        from: 'gredditdass@gmail.com',
        to: user1.email,
        subject: 'You have been blocked',
        text: 'Your post (text: ' + post.description + ' ) was reported and the moderator has decided to block you from the subgreddit ' + report.gname
    }

    transporter.sendMail(mailoptions1, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.send({ verdict: 'done' });
}