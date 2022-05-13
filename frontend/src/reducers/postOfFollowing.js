/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUSES } from './userSlice';

const postOfFollowingSlice = createSlice({
    name: 'postOfFollowing',
    initialState: {
        posts: {},
        status: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostOfFollowing.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(fetchPostOfFollowing.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.posts = action.payload;
            })
            .addCase(fetchPostOfFollowing.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});
export default postOfFollowingSlice.reducer;

export const fetchPostOfFollowing = createAsyncThunk('fetch/postOfFollowing', async () => {
    const res = await fetch('/api/v1/posts');
    const data = await res.json();
    return data;
});
