const ErrorHandler = require('../utils/errorHandler');
const Post = require('../models/post');
const User = require('../models/user');
const cloudinary = require('cloudinary')

exports.createPost = async (req, res, next) => {
    try {
        if(!req.body.caption || !req.body.image){
            next(new ErrorHandler('all fileds are required',400))
        }
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image,{
            folder: "posts",
            crop: "scale",
          })
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            owner: req.user._id,
        };

        const newPost = await Post.create(newPostData);
        const user = await User.findById(req.user._id);
        user.posts.push(newPost._id);
        await user.save();

        return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        next(next(new ErrorHandler(error.message, 500)));
    }
};

exports.likeUnlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'post not found',
            });
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).json({
                success: true,
                message: 'post unliked successfully',
            });
        }
        post.likes.push(req.user._id);
        await post.save();
        return res.status(200).json({
            success: true,
            message: 'post liked successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.commentOnPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        let commentIndex = -1;
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                commentIndex = index;
            }
        });

        if (commentIndex !== -1) {
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: 'comment updated',
            });
        }
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
        });
        await post.save();

        return res.status(200).json({
            success: true,
            message: 'comment added',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(200).json({
                success: false,
                message: 'post not found',
            });
        }

        if (post.owner.toString() === req.user._id.toString()) {
            if (req.body.commentId === undefined) {
                return res.status(200).json({
                    success: false,
                    message: 'comment id required',
                });
            }
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                  
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message: 'selected comment has deleted',
            });
        }

        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                return post.comments.splice(index, 1);
            }
        });
        await post.save();
        return res.status(200).json({
            success: true,
            message: 'your comment has deleted',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorHandler('post not found', 404));
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('unAuthorized user', 404));
        }
        await post.remove();
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'post deleted successfully',
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.getPostOfFollowing = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const allPosts = await Post.find({
            owner: { $in: user.following },
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            allPosts:allPosts.reverse()
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

exports.updateCaption = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorHandler('post not found', 404));
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler('unAuthorized user', 404));
        }
        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success: true,
            message: 'caption updated successfully',
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
