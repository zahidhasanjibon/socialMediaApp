/* eslint-disable no-underscore-dangle */
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUSES } from '../../reducers/userSlice';
import { fetchUsers } from '../../reducers/usersSlice';
import Loader from '../loader/Loader';
import User from '../user/user';
import './Search.css';

function Search() {
    const [name, setName] = React.useState('');

    const { users, status } = useSelector((state) => state.users);

    const dispatch = useDispatch();
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(fetchUsers(name));
    };

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="search">
            <form className="searchForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: '2vmax' }}>
                    Social Aap
                </Typography>

                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Search
                </Button>

                <div className="searchResults">
                    {users.users &&
                        users.users.map((user) => (
                            <User
                                key={user._id}
                                userId={user._id}
                                name={user.name}
                                avatar={user.avatar.url}
                            />
                        ))}
                </div>
            </form>
        </div>
    );
}

export default Search;
