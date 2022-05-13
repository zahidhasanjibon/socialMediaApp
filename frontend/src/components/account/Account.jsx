/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyPosts } from '../../reducers/myPostsSlice';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { userDetails } from '../../reducers/userDetailsSlice';
import { STATUSES, userRegLogin } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import Post from '../post/Post';
import toast from '../react-toast/reactToast';
import User from '../user/user';
import './Account.css';

function Account() {
    const dispatch = useDispatch();

    const { status, posts } = useSelector((state) => state.myPosts);
    const { user, statusOfUserDetails } = useSelector((state) => state.userDetails);
    // const {
    //     userData,
    //     isUpdated,
    //     status: deleteProfileStatus,
    // } = useSelector((state) => state.updateProfile);

    const [followersToggle, setFollowersToggle] = useState(false);

    const [followingToggle, setFollowingToggle] = useState(false);
    const logoutHandler = async () => {
        await dispatch(userRegLogin({ logout: 'logout' }));
        toast('Logout successsfully').success;
    };

    const deleteProfileHandler = async () => {
        await dispatch(updateProfileFunc({ deleteProfile: 'delete profile' }));
        dispatch(userRegLogin({ logout: 'logout' }));
    };

    useEffect(() => {
        dispatch(userDetails());
        dispatch(fetchMyPosts());
        // if (deleteProfileStatus === 'idle' && !isUpdated) {
        //     toast(userData.error).error();
        // }
    }, [dispatch]);

    if (status === STATUSES.LOADING || statusOfUserDetails === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }
    return (
        <div className="account">
            <div className="accountleft">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Post
                            key={post._id}
                            postId={post._id}
                            caption={post.caption}
                            postImage={post.image.url}
                            likes={post.likes}
                            comments={post.comments}
                            ownerImage={user.user.avatar.url}
                            ownerName={user.user.name}
                            ownerId={user.user._id}
                            isAccount="account"
                            isDelete
                        />
                    ))
                ) : (
                    <Typography variant="h6">You have not made any post</Typography>
                )}
            </div>
            {user.user && (
                <div className="accountright">
                    <Avatar src={user.user.avatar.url} sx={{ height: '8vmax', width: '8vmax' }} />

                    <Typography variant="h5">{user.user.name}</Typography>

                    <div>
                        <button type="button" onClick={() => setFollowersToggle(!followersToggle)}>
                            <Typography>Followers</Typography>
                        </button>
                        <Typography>{user.user.followers.length}</Typography>
                    </div>

                    <div>
                        <button type="button" onClick={() => setFollowingToggle(!followingToggle)}>
                            <Typography>Following</Typography>
                        </button>
                        <Typography>{user.user.following.length}</Typography>
                    </div>

                    <div>
                        <Typography>Posts</Typography>
                        <Typography>{user.user.posts.length}</Typography>
                    </div>

                    <Button variant="contained" onClick={logoutHandler}>
                        Logout
                    </Button>

                    <Link to="/update/profile">Edit Profile</Link>
                    <Link to="/update/password">Change Password</Link>

                    <Button
                        variant="text"
                        style={{ color: 'red', margin: '2vmax' }}
                        onClick={deleteProfileHandler}
                    >
                        Delete My Profile
                    </Button>

                    <Dialog
                        open={followersToggle}
                        onClose={() => setFollowersToggle(!followersToggle)}
                    >
                        <div className="DialogBox">
                            <Typography variant="h4">Followers</Typography>

                            {user.user && user.user.followers.length > 0 ? (
                                user.user.followers.map((follower) => (
                                    <User
                                        key={follower._id}
                                        userId={follower._id}
                                        name={follower.name}
                                        avatar={follower.avatar.url}
                                    />
                                ))
                            ) : (
                                <Typography style={{ margin: '2vmax' }}>
                                    You have no followers
                                </Typography>
                            )}
                        </div>
                    </Dialog>

                    <Dialog
                        open={followingToggle}
                        onClose={() => setFollowingToggle(!followingToggle)}
                    >
                        <div className="DialogBox">
                            <Typography variant="h4">Following</Typography>

                            {user.user && user.user.following.length > 0 ? (
                                user.user.following.map((follow) => (
                                    <User
                                        key={follow._id}
                                        userId={follow._id}
                                        name={follow.name}
                                        avatar={follow.avatar.url}
                                    />
                                ))
                            ) : (
                                <Typography style={{ margin: '2vmax' }}>
                                    You are not following anyone
                                </Typography>
                            )}
                        </div>
                    </Dialog>
                </div>
            )}
        </div>
    );
}

export default Account;
