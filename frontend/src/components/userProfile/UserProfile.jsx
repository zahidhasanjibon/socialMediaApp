/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { userFollowFunc } from '../../reducers/userFollowUnfollowSlice';
import { STATUSES, usersPostsFunc } from '../../reducers/usersPostsSlice';
import { usersProfileFunc } from '../../reducers/usersProfieSlice';
import Loader from '../loader/Loader';
import Post from '../post/Post';
import User from '../user/user';

function UserProfile() {
    const dispatch = useDispatch();
    const { user: me, status: mineStatus } = useSelector((state) => state.user);
    const { posts, status: postStatus } = useSelector((state) => state.userPosts);
    const { user, status } = useSelector((state) => state.userProfile);

    const { id } = useParams();
    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    const [following, setFollowing] = useState(false);
    const [myProfile, setMyProfile] = useState(false);

    const followHandler = async () => {
        setFollowing(!following);
        await dispatch(userFollowFunc(id));
        dispatch(usersProfileFunc(id));
    };

    useEffect(() => {
        dispatch(usersProfileFunc(id));
        dispatch(usersPostsFunc(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (me.user._id === id) {
            setMyProfile(true);
        }
        if (user.followers) {
            user.followers.forEach((item) => {
                if (item._id === me.user._id) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
        }
    }, [me, id, user]);

    if (
        status === STATUSES.LOADING ||
        postStatus === STATUSES.LOADING ||
        mineStatus === STATUSES.LOADING
    ) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR || postStatus === STATUSES.ERROR) {
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
                            ownerImage={post.owner.avatar.url}
                            ownerName={post.owner.name}
                            ownerId={post.owner._id}
                            isAccount={id}
                        />
                    ))
                ) : (
                    <Typography variant="h6">User has not made any post</Typography>
                )}
            </div>
            <div className="accountright">
                {user && user.avatar && (
                    <>
                        <Avatar src={user.avatar.url} sx={{ height: '8vmax', width: '8vmax' }} />

                        <Typography variant="h5">{user.name}</Typography>

                        <div>
                            <button
                                type="button"
                                onClick={() => setFollowersToggle(!followersToggle)}
                            >
                                <Typography>Followers</Typography>
                            </button>
                            <Typography>{user.followers.length}</Typography>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => setFollowingToggle(!followingToggle)}
                            >
                                <Typography>Following</Typography>
                            </button>
                            <Typography>{user.following.length}</Typography>
                        </div>

                        <div>
                            <Typography>Posts</Typography>
                            <Typography>{user.posts.length}</Typography>
                        </div>

                        {myProfile ? null : (
                            <Button
                                variant="contained"
                                style={{ background: following ? 'red' : '' }}
                                onClick={() => followHandler()}
                                disabled={status === STATUSES.LOADING}
                            >
                                {following ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                    </>
                )}
                <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
                    <div className="DialogBox">
                        <Typography variant="h4">Followers</Typography>

                        {user.followers && user.followers.length > 0 ? (
                            user.followers.map((follower) => (
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

                <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
                    <div className="DialogBox">
                        <Typography variant="h4">Following</Typography>

                        {user.following && user.following.length > 0 ? (
                            user.following.map((follow) => (
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
        </div>
    );
}

export default UserProfile;
