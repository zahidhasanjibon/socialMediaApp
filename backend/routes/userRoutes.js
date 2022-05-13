const express = require('express');

const router = express.Router();

const {
    followUser,
    updatePassword,
    updateProfile,
    deleteMyProfile,
    myProfile,
    getUserProfile,
    getAllusers,
    forgotPassword,
    resetPassword,
    getMyPosts,
    getUserPosts,
} = require('../controllers/userController');

const { register, login, logout } = require('../controllers/userController');
const isAuthenticate = require('../middlewares/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/follow/:id').get(isAuthenticate, followUser);
router.route('/update/password').put(isAuthenticate, updatePassword);
router.route('/update/profile').put(isAuthenticate, updateProfile);
router.route('/delete/me').delete(isAuthenticate, deleteMyProfile);
router.route('/me').get(isAuthenticate, myProfile);
router.route('/my/posts').get(isAuthenticate, getMyPosts);
router.route('/userposts/:id').get(isAuthenticate, getUserPosts);
router.route('/user/:id').get(isAuthenticate, getUserProfile);
router.route('/users').get(isAuthenticate, getAllusers);
router.route('/forgot/password').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

module.exports = router;
