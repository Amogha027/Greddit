const Post = require('../models/posts');

module.exports.saved_posts = async (req, res) => {
    // console.log(req.body);

    const user = req.username;
    const posts = await Post.find();
    const arr = posts.filter((obj) => {
        if (obj.saved.includes(user))
            return obj;
    })
    res.send({ posts: arr, user: user });
}

module.exports.remove_post = async (req, res) => {
    // console.log(req.body);

    await Post.findByIdAndUpdate({ _id: req.body.id }, {
        $pull: {
            saved: req.body.name
        }
    })
}