import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { AuthContext } from '../context/authContext';
import Search from './Search';

const Nav = () => {
    const {state, dispatch} = useContext(AuthContext)
    let navigate = useNavigate();
    const { user } = state;

    const logout = () => {
        auth.signOut();
        dispatch({
            type: 'LOGGED_IN_USER',
            payload: null
        });
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
                Navbar
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/users">
                            Users
                        </Link>
                    </li>
                {user && 
                    <li className="nav-item active">
                        <Link className="nav-link" to="/profile">
                            {user && user.email.split('@')[0]}
                        </Link>
                    </li>
                }
                {!user && <>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">
                            Register
                        </Link>
                    </li>
                </>}
                    {user && (
                        <li className="nav-item">
                            <Link onClick={logout} to="/login"   className='nav-item nav-link'>Logout
                            </Link>
                        </li>
                    )}
                </ul>
                <div className="ml-auto">
                    <Search />
                </div>
            </div>
        </nav>
    );
};

export default Nav;
