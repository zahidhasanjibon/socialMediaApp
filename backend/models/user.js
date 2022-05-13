const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'please Enter Your Name'] },
    email: {
        type: String,
        required: [true, 'please Enter Your Email'],
    },
    password: {
        type: String,
        required: [true, 'please enter your password'],
        minlength: [6, 'password length should be greater than 6 character'],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post',
        },
    ],
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
userSchema.methods.comparePassword = async function (enterdPassword) {
    const isMatched = await bcrypt.compare(enterdPassword, this.password);
    return isMatched;
};
userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
