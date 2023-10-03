import React from 'react';
import axios from 'axios';
import Login from './auth/Login';
import MainPage from './MainPage/MainPage';


const MainContent = (props) => {
    return(
        <MainPage
            url={props.url}
            setUrl={props.setUrl}
            host={props.host}
        />
    )
}

export default MainContent
