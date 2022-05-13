import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Account from './components/account/Account';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import Header from './components/Header/Header';
import Home from './components/home/Home';
import Login from './components/login/Login';
import NewPost from './components/newPost/NewPost';
import NotFound from './components/notFound/NotFound';
import Register from './components/register/Register';
import ResetPassword from './components/resetPassword/ResetPassword';
import Search from './components/search/Search';
import UpdatePassword from './components/updatePassword/UpdatePassword';
import UpdateProfile from './components/updateProfile/UpdateProfile';
import UserProfile from './components/userProfile/UserProfile';
import { userRegLogin } from './reducers/userSlice';

function App() {
    const dispatch = useDispatch();
    const { isAuthenticate } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(userRegLogin({ myProfile: 'loaduser' }));
    }, [dispatch]);
    return (
        <Router>
            <ToastContainer />
            {isAuthenticate && <Header />}

            <Routes>
                <Route path="/" element={isAuthenticate ? <Home /> : <Login />} />
                <Route path="/account" element={isAuthenticate ? <Account /> : <Login />} />
                <Route path="/newpost" element={isAuthenticate ? <NewPost /> : <Login />} />
                <Route
                    path="/register"
                    element={isAuthenticate ? <Navigate to="/account" /> : <Register />}
                />
                <Route path="/forgot/password" element={<ForgotPassword />} />
                <Route path="/password/reset/:token" element={<ResetPassword />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route
                    path="/update/profile"
                    element={isAuthenticate ? <UpdateProfile /> : <Login />}
                />
                <Route
                    path="/update/password"
                    element={isAuthenticate ? <UpdatePassword /> : <Login />}
                />
                <Route path="/search" element={isAuthenticate ? <Search /> : <Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
