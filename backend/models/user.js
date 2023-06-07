const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    }
}, { timestamps: true });

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;