import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { STATUSES, userRegLogin } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './Login.css';

function Login() {
    const dispatch = useDispatch();
    const { user, status, isAuthenticate } = useSelector((state) => state.user);
    const {
        userData,
        isUpdated,
        status: deleteProfileStatus,
    } = useSelector((state) => state.updateProfile);
    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = (e) => {
        e.preventDefault();
        const loginData = { email, password };
        dispatch(userRegLogin({ loginData }));
    };

    useEffect(() => {
        if (status === 'idle' && !isAuthenticate) {
            toast(user.error).error();
        }
        if (status === 'idle' && isAuthenticate) {
            history('/');
        }

        if (deleteProfileStatus === 'idle' && isUpdated) {
            toast(userData.message).success();
            dispatch(updateProfileFunc({ reset: 'to false isUpdated' }));
        }
    }, [status, isAuthenticate, history, user, dispatch, userData, deleteProfileStatus, isUpdated]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }

    return (
        <div className="login">
            <form className="loginForm" onSubmit={loginHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/forgot/password">
                    <Typography>Forgot Password?</Typography>
                </Link>

                <Button type="submit">Login</Button>

                <Link to="/register">
                    <Typography>New User?</Typography>
                </Link>
            </form>
        </div>
    );
}

export default Login;
