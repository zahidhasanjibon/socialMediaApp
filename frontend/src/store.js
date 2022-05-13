import { configureStore } from '@reduxjs/toolkit';
import myPostsReducer from './reducers/myPostsSlice';
import postOfFollowingReducer from './reducers/postOfFollowing';
import postReducer from './reducers/postSlice';
import updateProfileReducer from './reducers/updateProfileSlice';
import userDetailsReducer from './reducers/userDetailsSlice';
import userFollowUnfollowReducer from './reducers/userFollowUnfollowSlice';
import userReducer from './reducers/userSlice';
import usersPostsReducer from './reducers/usersPostsSlice';
import usersProfileReducer from './reducers/usersProfieSlice';
import usersReducer from './reducers/usersSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        users: usersReducer,
        postFunctionality: postReducer,
        myPosts: myPostsReducer,
        userDetails: userDetailsReducer,
        updateProfile: updateProfileReducer,
        userPosts: usersPostsReducer,
        userProfile: usersProfileReducer,
        userFollow: userFollowUnfollowReducer,
    },
});

export default store;
