const Greddit = require('../models/greddit');
const Post = require('../models/posts');
const Report = require('../models/reports');
const User = require('../models/user');

module.exports.get_greddit = async (req, res) => {
    // console.log(req.body);
    const user = req.username;

    try {
        const greddit = await Greddit.findOne({ name: req.body.name })
            .catch((err) => {
                res.status(400).send(err);
            })

        const moderator = greddit.moderator;
        if (greddit.followers.includes(user)) {
            const posts = await Post.find({ gname : req.body.name })
                .catch((err) => {
                    console.log(err);
                })

            var names = [];
            posts.map((obj) => {
                if (obj.status === 'passive')
                    names.push(obj.pname);
            })

            const arr = posts.filter((obj) => {
                if (moderator !== user) {
                    var temp = obj;
                    if (names.includes(obj.pname))
                        temp.pname = 'Blocked User';
                    obj.comments.map((cobj, idx) => {
                        if (names.includes(cobj.name))
                            temp.comments[idx].name = 'Blocked User';
                    })
                    return temp;
                }
                return obj;
            })
            res.send({ verdict: 'done', user: user, subGreddit: greddit, flag: 'true', posts: arr })
        } else {
            res.send({ verdict: 'done', user: user, subGreddit: greddit, flag: 'false' });
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports.create_post = async (req, res) => {
    // console.log(req.body);

    try {
        const subgreddit = await Greddit.findOne({ name: req.body.gname });
        if (!subgreddit.followers.includes(req.body.pname)) {
            res.send({ verdict: 'not a user' });
        } else {
            var words = req.body.description.split(" ");

            words.map((item, idx) => {
                if (subgreddit.keywords.includes(item)) {
                    let len = item.length, temp = '';
                    for (let i = 0; i < len; i++) {
                        temp = temp.concat('*');
                    }
                    words[idx] = temp;
                } 
            });

            req.body.description = words.join(" ");
            // console.log(req.body.description);
            const post = new Post(req.body);

            await post.save()
                .then(async (result) => {
                    await Greddit.findByIdAndUpdate({ _id: subgreddit._id }, {
                        posts: 1 + subgreddit.posts
                    });
                    res.send({ verdict: 'done', result });
                })
                .catch((err) => res.status(400).send(err));
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports.add_upvote = async (req, res) => {
    // console.log(req.body);

    const post = await Post.findById({ _id: req.body.id });
    if (post.upvotes.includes(req.body.name)) {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $pull: {
                upvotes: req.body.name
            }
        })
    } else {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $pull: {
                downvotes: req.body.name
            }, 
            $push: {
                upvotes: req.body.name
            }
        })
    }
}

module.exports.add_downvote = async (req, res) => {
    // console.log(req.body);

    const post = await Post.findById({ _id: req.body.id });
    if (post.downvotes.includes(req.body.name)) {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $pull: {
                downvotes: req.body.name
            }
        })
    } else {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $push: {
                downvotes: req.body.name
            }, 
            $pull: {
                upvotes: req.body.name
            }
        })
    }
}

module.exports.add_report = async (req, res) => {
    // console.log(req.body);

    try {
        const greddit = await Greddit.findOne({ name: req.body.gname });
        // console.log(greddit.moderator);
        // console.log(req.body.reported_to);
        if (greddit.moderator === req.body.reported_to) {
            res.send({ verdict: 'cannot report a moderator' });
        } else {
            const report = new Report(req.body);
            // console.log(report);

            report.save()
                .then((result) => res.send({ result }))
                .catch((err) => res.status(400).send(err));
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
}

module.exports.add_follow = async (req, res) => {
    // console.log(req.body);

    const user = await User.findOne({ userName: req.body.name1 });
    if (user.following.includes(req.body.name2)) {
        res.send({ verdict: 'already following' });
    } else {
        await User.findOneAndUpdate({ userName: req.body.name1 }, {
            $push: {
                following: req.body.name2
            }
        })
            .catch((err) => {
                res.status(400).send(err);
            })

        await User.findOneAndUpdate({ userName: req.body.name2 }, {
            $push: {
                followers: req.body.name1
            }
        })
            .catch((err) => {
                res.status(400).send(err);
            })
        res.send({ verdict: 'added now' });
    }
}

module.exports.save_post = async (req, res) => {
    // console.log(req.body);

    const post = await Post.findById({ _id: req.body.id });
    if (post.saved.includes(req.body.name)) {
        res.send({ verdict: 'already saved' });
    } else {
        await Post.findByIdAndUpdate({ _id: req.body.id }, {
            $push: {
                saved: req.body.name
            }
        })
            .catch((err) => {
                res.status(400).send(err);
            })
        res.send({ verdict: 'saved now' });
    }
}

module.exports.add_comment = async (req, res) => {
    // console.log(req.body);

    await Post.findByIdAndUpdate({ _id: req.body.id }, {
        $push: {
            comments: {
                name: req.body.name,
                day: req.body.day,
                comment: req.body.comment
            }
        }
    })
}