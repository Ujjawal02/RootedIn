import React from 'react';
import { Navigate, Outlet, replace } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectAuthChecked } from '../../features/auth/authSlice';

const ProtectedRoute = ({allowedRoles}) => {
    const user = useSelector(selectCurrentUser);
    const authChecked = useSelector(selectAuthChecked);

    if(!authChecked){
        return <div 
        className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    }

    if(!user){
        return <Navigate to={"/login"} replace/>
    }

    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to={"/"} replace/>
    }

    return <Outlet/>
}

export default ProtectedRoute