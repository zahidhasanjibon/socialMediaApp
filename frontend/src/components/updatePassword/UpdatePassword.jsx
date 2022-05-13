import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { STATUSES } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './UpdatePassword.css';

function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const dispatch = useDispatch();
    const history = useNavigate();
    const { userData, isUpdated, status } = useSelector((state) => state.updateProfile);

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatePasswordData = { oldPassword, newPassword };
        await dispatch(updateProfileFunc({ updatePasswordData }));
        // await dispatch(userRegLogin({ myProfile: 'loaduser' }));
    };

    useEffect(() => {
        if (status === 'idle' && !isUpdated) {
            toast(userData.error).error();
        }
        if (status === 'idle' && isUpdated) {
            toast(userData.message).success();
            history('/account');
            dispatch(updateProfileFunc({ reset: 'to false isUpdated' }));
        }
    }, [status, dispatch, history, userData, isUpdated]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="updatePassword">
            <form className="updatePasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    className="updatePasswordInputs"
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    required
                    className="updatePasswordInputs"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Change Password
                </Button>
            </form>
        </div>
    );
}

export default UpdatePassword;
