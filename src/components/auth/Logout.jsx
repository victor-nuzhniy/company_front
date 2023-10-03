import React from 'react';
import {useNavigate} from 'react-router-dom';

const Logout = () => {
    localStorage.removeItem("token")
    const navigate = useNavigate()
    React.useEffect(() => {
        navigate("/login")
    })
};

export default Logout;
