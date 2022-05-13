import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { STATUSES, userRegLogin } from '../../reducers/userSlice';
import Loader from '../loader/Loader';
import './Register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.user);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        };
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const registerData = {
            name,
            email,
            avatar,
            password,
        };
        dispatch(userRegLogin({ registerData }));
    };

    useEffect(() => {}, []);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }
    return (
        <div className="register">
            <form className="registerForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <Avatar src={avatar} alt="User" sx={{ height: '10vmax', width: '10vmax' }} />

                <input type="file" accept="image/*" onChange={handleImageChange} />

                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="registerInputs"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="registerInputs"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="registerInputs"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/">
                    <Typography>Already Signed Up? Login Now</Typography>
                </Link>

                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Sign Up
                </Button>
            </form>
        </div>
    );
}

export default Register;
