
import {
    AccountCircle,
    AccountCircleOutlined,
    Add,
    AddOutlined,
    Home,
    HomeOutlined,
    Search,
    SearchOutlined
} from '@mui/icons-material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';





function Header() {
    const [tab, setTab] = useState(window.location.pathname);
    return (
        <div className="header">
            <Link to="/" onClick={() => setTab('/')}>
                {tab === '/' ? <Home style={{ color: 'black' }} /> : <HomeOutlined />}
            </Link>

            <Link to="/newpost" onClick={() => setTab('/newpost')}>
                {tab === '/newpost' ? <Add style={{ color: 'black' }} /> : <AddOutlined />}
            </Link>

            <Link to="/search" onClick={() => setTab('/search')}>
                {tab === '/search' ? <Search style={{ color: 'black' }} /> : <SearchOutlined />}
            </Link>

            <Link to="/account" onClick={() => setTab('/account')}>
                {tab === '/account' ? (
                    <AccountCircle style={{ color: 'black' }} />
                ) : (
                    <AccountCircleOutlined />
                )}
            </Link>
         
        </div>
    );
}

export default Header;
