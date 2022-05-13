const express = require('express');

const router = express.Router();

const isAuthenticate = require('../middlewares/auth');
const {
    createPost,
    likeUnlikePost,
    deletePost,
    getPostOfFollowing,
    updateCaption,
    commentOnPost,
    deleteComment,
} = require('../controllers/postController');

router.route('/post/create').post(isAuthenticate, createPost);
router
    .route('/post/:id')
    .get(isAuthenticate, likeUnlikePost)
    .put(isAuthenticate, updateCaption)
    .delete(isAuthenticate, deletePost);
router.route('/posts').get(isAuthenticate, getPostOfFollowing);
router
    .route('/post/comment/:id')
    .post(isAuthenticate, commentOnPost)
    .delete(isAuthenticate, deleteComment);

module.exports = router;
