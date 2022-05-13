/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUSES } from './userSlice';

const myPostsSlice = createSlice({
    name: 'myPosts',
    initialState: {
        posts: {},
        status: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyPosts.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(fetchMyPosts.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.posts = action.payload.posts;
            })
            .addCase(fetchMyPosts.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});
export default myPostsSlice.reducer;

export const fetchMyPosts = createAsyncThunk('fetch/myPosts', async () => {
    const res = await fetch('/api/v1/my/posts');
    const data = await res.json();
    return data;
});
