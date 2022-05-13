import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { STATUSES } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();
    // eslint-disable-next-line no-unused-vars
    const { userData, status, isUpdated } = useSelector((state) => state.updateProfile);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProfileFunc({ forgotPasswordEmail: email }));
    };

    useEffect(() => {
        if (status === 'idle' && !isUpdated) {
            toast(userData.error).error();
        }
        if (status === 'idle' && isUpdated) {
            toast(userData.message).success();
            dispatch(updateProfileFunc({ reset: 'to false isUpdated' }));
        }
    }, [userData, status, isUpdated, dispatch]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="forgotPassword">
            <form className="forgotPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="forgotPasswordInputs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Send Token
                </Button>
            </form>
        </div>
    );
}

export default ForgotPassword;
