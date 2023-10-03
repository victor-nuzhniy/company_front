import React from 'react';
import {useNavigate, Outlet} from 'react-router-dom';

const PrivateRoute = () => {
    const auth = localStorage.getItem("token")
    const navigate = useNavigate()
    React.useEffect(() => {
        if (!auth) {
            navigate("/login")
        }
    })
    return <Outlet />;
};

export default PrivateRoute
