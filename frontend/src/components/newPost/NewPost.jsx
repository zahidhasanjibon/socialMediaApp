import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postFunctionality } from '../../reducers/postSlice';
import { STATUSES } from '../../reducers/userDetailsSlice';
import Loader from '../loader/Loader';
import toast from '../react-toast/reactToast';
import './NewPost.css';

function NewPost() {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const dispatch = useDispatch();
    const { status, data } = useSelector((state) => state.postFunctionality);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImage(Reader.result);
            }
        };
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(postFunctionality({ captionFromNewPost: caption, image }));
        // const postData = new FormData();
        // postData.set('caption', caption);
        // postData.set('image', image);
        // await dispatch(
        //     postFunctionality({
        //         postData,
        //     })
        // );
        await dispatch(postFunctionality({ clearState: 'clear like comnt state' }));
    };

    useEffect(() => {
        if (data.success) {
            toast('post upload successfully').success();
        }
        if (!data.success) {
            toast(data.error).success();
        }
    }, [data]);

    if (status === STATUSES.LOADING) {
        return <Loader />;
    }
    if (status === STATUSES.ERROR) {
        return <h2 className="errorHeading">Error Occurs</h2>;
    }

    return (
        <div className="newPost">
            <form className="newPostForm" onSubmit={submitHandler}>
                <Typography variant="h3">New Post</Typography>

                {image && <img src={image} alt="post" />}
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <input
                    type="text"
                    placeholder="Caption..."
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <Button disabled={status === STATUSES.LOADING} type="submit">
                    Post
                </Button>
            </form>
        </div>
    );
}

export default NewPost;
