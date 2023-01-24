import React, {useContext, useState, useEffect} from 'react'
import { Routes, Route, Link, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

export default function PrivateRoute({children, ...rest}) {
    const {state} = useContext(AuthContext);
    const [user, setUser] = useState(false);
  
    useEffect(() => {
        if(state.user){
            setUser(true);
        }
    }, [state.user])

    const navLinks = () => (
        <nav>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                        Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/password/update">
                        Password
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/post/create">
                        Post
                    </Link>
                </li>
            </ul>
        </nav>
    )

    const renderContent = 
        <div className='container-fluid pt-5'>
            <div className='row'>
                <div className="col-md-4">
                    {navLinks()}
                </div>
                <div className="col-md-8">
                  <Outlet/>
                </div>
            </div>
        </div>
        
    
    return user ? renderContent : <h4>Loading...</h4>
}
