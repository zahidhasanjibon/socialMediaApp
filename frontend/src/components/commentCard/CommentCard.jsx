/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { Delete } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyPosts } from '../../reducers/myPostsSlice';
import { fetchPostOfFollowing } from '../../reducers/postOfFollowing';
import { postFunctionality } from '../../reducers/postSlice';
import { usersPostsFunc } from '../../reducers/usersPostsSlice';
import './CommentCard.css';

function CommentCard({ userId, name, avatar, comment, isAccount, commentId, postId }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const deleteCommentHandle = async () => {
        await dispatch(
            postFunctionality({
                deleteCommentOfCommentId: commentId,
                deleteCommentOfPostId: postId,
            })
        );
        await dispatch(postFunctionality({ clearState: 'clear like comnt state' }));
        if (isAccount === 'home') {
            dispatch(fetchPostOfFollowing());
        } else if (isAccount === 'account') {
            dispatch(fetchMyPosts());
        } else {
            dispatch(usersPostsFunc(isAccount));
        }
    };

    return (
        <div className="commentUser">
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: '6vmax' }}>{name}</Typography>
            </Link>
            <Typography>{comment}</Typography>

            {isAccount === 'account' ? (
                <Button onClick={deleteCommentHandle}>
                    <Delete />
                </Button>
            ) : userId === user.user._id ? (
                <Button onClick={deleteCommentHandle}>
                    <Delete />
                </Button>
            ) : null}
        </div>
    );
}

export default CommentCard;
