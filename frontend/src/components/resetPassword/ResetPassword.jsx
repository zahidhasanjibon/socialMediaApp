import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { STATUSES } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './ResetPassword.css';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const dispatch = useDispatch();
    const { token } = useParams();
    const { userData, status, isUpdated } = useSelector((state) => state.updateProfile);
    const submitHandler = (e) => {
        e.preventDefault();
        const resetPasswordData = {
            password: newPassword,
        };
        dispatch(updateProfileFunc({ resetPasswordData, token }));
    };

    useEffect(() => {
        if (status === 'idle' && !isUpdated) {
            toast(userData.error).error();
        }
        if (status === 'idle' && isUpdated) {
            toast(userData.message).success();
            dispatch(updateProfileFunc({ reset: 'to false isUpdated' }));
        }
    }, [status, userData, dispatch, isUpdated]);
    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <input
                    type="password"
                    placeholder="New Password"
                    required
                    className="updatePasswordInputs"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <Link to="/account">
                    <Typography>Login</Typography>
                </Link>
                <Typography>Or</Typography>

                <Link to="/forgot/password">
                    <Typography>Request Another Token!</Typography>
                </Link>

                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Reset Password
                </Button>
            </form>
        </div>
    );
}

export default ResetPassword;
