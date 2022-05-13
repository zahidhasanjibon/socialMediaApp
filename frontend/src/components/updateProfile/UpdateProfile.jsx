import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfileFunc } from '../../reducers/updateProfileSlice';
import { STATUSES, userRegLogin } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './UpdateProfile.css';

function UpdateProfile() {
    const { status, user } = useSelector((state) => state.user);
    const {
        userData,
        isUpdated,
        status: updateStatus,
    } = useSelector((state) => state.updateProfile);
    const history = useNavigate();
    const [name, setName] = useState(user.user.name);
    const [email, setEmail] = useState(user.user.email);
    const [avatar, setAvatar] = useState('');
    const [avatarPrev, setAvatarPrev] = useState(user.user.avatar.url);

    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatarPrev(Reader.result);

                setAvatar(Reader.result);
            }
        };
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const updateProfileData = { name, email, avatar };
        await dispatch(updateProfileFunc({ updateProfileData }));
        await dispatch(userRegLogin({ myProfile: 'loaduser' }));
    };

    useEffect(() => {
        if (status === 'idle' && !isUpdated) {
            toast(userData.error).error();
        }
        if (status === 'idle' && isUpdated) {
            toast('Profile Updated successfully').success();
            history('/account');
            dispatch(updateProfileFunc({ reset: 'to false isUpdated' }));
        }
    }, [status, dispatch, history, isUpdated, userData]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="updateProfile">
            <form className="updateProfileForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <Avatar src={avatarPrev} alt="User" sx={{ height: '10vmax', width: '10vmax' }} />

                <input type="file" accept="image/*" onChange={handleImageChange} />

                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="updateProfileInputs"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="updateProfileInputs"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button disabled={updateStatus === STATUSES.LOADING} type="submit">
                    Update
                </Button>
            </form>
        </div>
    );
}

export default UpdateProfile;
