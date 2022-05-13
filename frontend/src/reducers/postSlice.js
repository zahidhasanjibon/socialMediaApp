/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUSES } from './userSlice';

const postSlice = createSlice({
    name: 'postFunctionality',
    initialState: {
        data: {},
        status: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(postFunctionality.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(postFunctionality.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.data = action.payload;
            })
            .addCase(postFunctionality.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});
export default postSlice.reducer;

export const postFunctionality = createAsyncThunk(
    'post/likeComment',
    async ({
        likesOfPostId,
        commentOfPostId,
        commentValue,
        clearState,
        deleteCommentOfPostId,
        deleteCommentOfCommentId,
        deletePostId,
        captionUpdatePostId,
        caption,
        image,
        captionFromNewPost,
        postData,
    }) => {
        if (likesOfPostId) {
            const res = await fetch(`/api/v1/post/${likesOfPostId}`);
            const data = await res.json();
            return data;
        }
        if (commentOfPostId && commentValue) {
            const res = await fetch(`/api/v1/post/comment/${commentOfPostId}`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: commentValue }),
            });
            const data = await res.json();
            return data;
        }
        if (clearState) {
            return {
                success: false,
                message: 'clear like coment state',
            };
        }
        if (deleteCommentOfPostId && deleteCommentOfCommentId) {
            const res = await fetch(`/api/v1/post/comment/${deleteCommentOfPostId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: deleteCommentOfCommentId }),
            });
            const data = await res.json();
            return data;
        }
        if (deletePostId) {
            const res = await fetch(`/api/v1/post/${deletePostId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            return data;
        }
        if (captionUpdatePostId && caption) {
            const res = await fetch(`/api/v1/post/${captionUpdatePostId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption }),
            });
            const data = await res.json();
            return data;
        }
        if (captionFromNewPost && image) {
            const res = await fetch(`/api/v1/post/create`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption: captionFromNewPost, image }),
            });
            const data = await res.json();
            return data;
            // const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            // const res = await fetch(`/api/v1/post/create`, {
            //     method: 'post',
            //     config,
            //     body: postData,
            // });
            // const data = await res.json();
            // return data;
        }
    }
);
