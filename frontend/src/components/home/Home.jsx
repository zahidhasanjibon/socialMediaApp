/* eslint-disable no-underscore-dangle */
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostOfFollowing } from '../../reducers/postOfFollowing';
// import { postFunctionality } from '../../reducers/postSlice';
import { STATUSES } from '../../reducers/userSlice';
import { fetchUsers } from '../../reducers/usersSlice';
import Loader from '../loader/Loader';
import Post from '../post/Post';
import toast from '../react-toast/reactToast';
import User from '../user/user';
import './Home.css';

function Home() {
    const dispatch = useDispatch();

    const { status, posts } = useSelector((state) => state.postOfFollowing);

    const { users } = useSelector((state) => state.users);
    const { data } = useSelector((state) => state.postFunctionality);

    useEffect(() => {
        dispatch(fetchPostOfFollowing());
        dispatch(fetchUsers());
        if (data.success) {
            toast(data.message).success();
        }
    }, [dispatch, data]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="home">
            <div className="homeleft">
                {posts.allPosts && posts.allPosts.length > 0 ? (
                    posts.allPosts.map((post) => (
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
                            isAccount="home"
                        />
                    ))
                ) : (
                    <Typography variant="h6">No posts yet</Typography>
                )}
            </div>
            <div className="homeright">
                {users.users && users.users.length > 0 ? (
                    users.users.map((user) => (
                        <User
                            key={user._id}
                            userId={user._id}
                            name={user.name}
                            avatar={user.avatar.url}
                        />
                    ))
                ) : (
                    <Typography>No Users Yet</Typography>
                )}
            </div>
        </div>
    );
}

export default Home;
