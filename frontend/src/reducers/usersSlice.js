/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STATUSES } from './userSlice';

const usersSlice = createSlice({
    name: 'allUsers',
    initialState: {
        users: {},
        status: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = STATUSES.LOADING;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = STATUSES.IDLE;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = STATUSES.ERROR;
            });
    },
});
export default usersSlice.reducer;

export const fetchUsers = createAsyncThunk('fetch/allUsers', async (name = '') => {
    const res = await fetch(`/api/v1/users?name=${name}`);
    const data = await res.json();
    return data;
});
