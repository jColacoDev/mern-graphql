import React, {useContext, useEffect} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

export default function PublicRoute() {
    const {state} = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if(state.user){
            navigate('/profile');
        }
    }, [state.user])

    const renderContent = 
        <div className='container-fluid p-5'>
            <Outlet/>
        </div>
    
    return renderContent;
}
