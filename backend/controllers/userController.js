/* eslint-disable no-unused-vars */

const crypto = require('crypto');
const User = require('../models/user');
const Post = require('../models/post');
const ErrorHandler = require('../utils/errorHandler');
const { sendEmail } = require('../utils/sendEmail');
const cloudinary = require('cloudinary')

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        if(!name || !email || !password){
            next(new ErrorHandler('all fields are required'))
        }
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            crop: "scale",
          })

        let user = await User.findOne({ email });

        if (user) {
            return next(new ErrorHandler('user already exist with this email', 400));
        }

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url:  myCloud.secure_url
            },
        });
        const token = user.generateToken();
        const options = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        return res.status(200).cookie('token', token, options).json({
            success: true,
            user,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
   
    if (!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('user not found', 404));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('incorrect email or password', 401));
    }

    if (isPasswordMatched) {
        const token = user.generateToken();
        const options = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            user,
            token,
        });
    }
};

exports.logout = async (req, res, next) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: 'Logout successfully',
    });
};

exports.followUser = async (req, res, next) => {
    try {
        const userToFoollow = await User.findById(req.params.id);
        const loggedInuser = await User.findById(req.user._id);

        if (!userToFoollow) {
            return next(new ErrorHandler('user not found', 404));
        }

        if (loggedInuser.following.includes(userToFoollow._id)) {
            const index = loggedInuser.following.indexOf(userToFoollow._id);
            loggedInuser.following.splice(index, 1);
            await loggedInuser.save();

            const targetUserindex = userToFoollow.followers.indexOf(loggedInuser._id);
            userToFoollow.followers.splice(targetUserindex, 1);
            await userToFoollow.save();
            return res.status(200).json({
                success: true,
                message: 'unfollowed user ',
            });
        }
        userToFoollow.followers.push(loggedInuser._id);
        loggedInuser.following.push(userToFoollow._id);

        await userToFoollow.save();
        await loggedInuser.save();
        return res.status(200).json({
            success: true,
            message: 'user followed',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler('all fields are required', 400));
        }
        const user = await User.findById(req.user._id).select('+password');

        const isMatched = await user.comparePassword(oldPassword);

        if (!isMatched) {
            return next(new ErrorHandler("old password dosen't match", 401));
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'password updated successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email,avatar } = req.body;

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(avatar,{
                folder: "avatars",
                width: 150,
                crop: "scale",
              })
              user.avatar.public_id = myCloud.public_id
              user.avatar.url  = myCloud.secure_url
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: 'update profile successfully',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { posts } = user;
        const userId = user._id;
        const { followers } = user;
        const { following } = user;
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        await user.remove();
        res.clearCookie('token');

        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id)
            await post.remove();
        }

        for (let j = 0; j < followers.length; j++) {
            const followerUser = await User.findById(followers[j]);
            const index = followerUser.following.indexOf(userId);
            followerUser.following.splice(index, 1);
            await followerUser.save();
        }

        for (let z = 0; z < following.length; z++) {
            const followingUser = await User.findById(following[z]);
            const index = followingUser.followers.indexOf(userId);
            followingUser.followers.splice(index, 1);
            await followingUser.save();
        }
         // removing all comments of the user from all posts
    const allPosts = await Post.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // removing all likes of the user from all posts

    for (let i = 0; i < allPosts.length; i++) {
      const post = await Post.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

        res.status(200).json({
            success: true,
            message: 'user deleted successfully',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.myProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('posts followers following');
        
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
exports.getMyPosts = async(req,res,next) => {
    try {
        const user = await User.findById(req.user._id)
     const posts = []

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate('likes comments.user')
            posts.push(post)
        }
        res.status(200).json({
            success: true,
            posts:posts.reverse()
        });

    } catch (error) {
            next(new ErrorHandler(error.message,500))
    }

}
exports.getUserPosts = async(req,res,next) => {
    try {
        const user = await User.findById(req.params.id)
     const posts = []

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate('owner likes comments.user')
            posts.push(post)
        }
        res.status(200).json({
            success: true,
            posts:posts.reverse()
        });

    } catch (error) {
            next(new ErrorHandler(error.message,500))
    }

}

exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate('posts followers following');
        if (!user) {
            next(new ErrorHandler('user not found', 500));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.getAllusers = async (req, res, next) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: 'i' }});

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found',
            });
        }
        const resetPasswordToken = user.getResetToken();
        await user.save();
        const resetPasswordUrl = `${req.protocol}://${req.get(
            'host',
        )}/password/reset/${resetPasswordToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Password',
                message,
            });
            res.status(200).json({
                success: true,

                message: `email sent to ${user.email} successfully`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    // creating token hash

    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(
                new ErrorHandler('Reset Password Token is invalid or has been expired', 400),
            );
        }
       
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({
            success: true,
            message: 'password set successfully',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 5000));
    }
};
