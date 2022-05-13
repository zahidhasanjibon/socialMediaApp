/* eslint-disable no-underscore-dangle */

import {
  ChatBubbleOutline,
  DeleteOutline,
  Favorite,
  FavoriteBorder,
  MoreVert
} from "@mui/icons-material";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyPosts } from "../../reducers/myPostsSlice";
import { fetchPostOfFollowing } from "../../reducers/postOfFollowing";
import { postFunctionality } from "../../reducers/postSlice";
import { userDetails } from "../../reducers/userDetailsSlice";
import { usersPostsFunc } from "../../reducers/usersPostsSlice";
import CommentCard from "../commentCard/CommentCard";
import toast from "../react-toast/reactToast";
import User from "../user/user";
import "./Post.css";

function Post({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = 'home'
}) {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);


  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(postFunctionality({ likesOfPostId: postId }));
     await  dispatch(postFunctionality({ clearState: 'clear like comnt state' }));

    if (isAccount === 'home') {
      dispatch(fetchPostOfFollowing());
    } else if(isAccount === 'account') {
      dispatch(fetchMyPosts())
    } else {
      dispatch(usersPostsFunc(isAccount));
    }
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(
      postFunctionality({ commentOfPostId: postId, commentValue })
    );
    await  dispatch(postFunctionality({ clearState: 'clear like comnt state' }));

    if (isAccount === 'home') {
      dispatch(fetchPostOfFollowing());
    } else if(isAccount === 'account') {
      dispatch(fetchMyPosts())
    } else {
      dispatch(usersPostsFunc(isAccount));
    }
  };

  const updateCaptionHandler = async (e) => {
    e.preventDefault();
   await dispatch(postFunctionality({
      captionUpdatePostId:postId,
      caption:captionValue
    }))
    toast('caption updated').success()
    await  dispatch(postFunctionality({ clearState: 'clear like comnt state' }));
    await dispatch(fetchMyPosts())
  };

  const deletePostHandler = async () => {
    await dispatch(postFunctionality({deletePostId:postId}))
    toast('post deleted').success()
    await  dispatch(postFunctionality({ clearState: 'clear like comnt state' }));
    dispatch(fetchMyPosts())
    dispatch(userDetails())
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user.user._id) {
        setLiked(true);
      }
    });
  }, [likes, user]);

  return (
    <div className="post">
      <div className="postHeader">
        {isAccount === 'account'? (
          <Button onClick={() => setCaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        ) : null}
      </div>

      <img src={postImage} alt="Post" />

      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{
            height: "3vmax",
            width: "3vmax",
          }}
        />

        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>

      <button
        type="button"
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0}
      >
        <Typography>{likes.length} Likes</Typography>
      </button>

      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>
        <Button onClick={() => setCommentToggle(!commentToggle)}>
          <ChatBubbleOutline />
        </Button>

        {isDelete ? (
          <Button onClick={deletePostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>

      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By</Typography>

          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url ? like.avatar.url : ''}
            />
          ))}
        </div>
      </Dialog>

      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments</Typography>

          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="Comment Here..."
              required
            />

            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>

          {comments.length > 0 ? (
            comments.map((item) => (
              <CommentCard
                userId={item.user._id}
                name={item.user.name}
                avatar={item.user.avatar.url}
                comment={item.comment}
                commentId={item._id}
                key={item._id}
                postId={postId}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography>No comments Yet</Typography>
          )}
        </div>
      </Dialog>

      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update Caption</Typography>

          <form className="commentForm" onSubmit={updateCaptionHandler}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here..."
              required
            />

            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default Post;
