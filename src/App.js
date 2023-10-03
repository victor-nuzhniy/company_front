import logo from './logo.svg';
import './App.css';
import React from 'react';
import MainContent from './components/MainContent';
import Login from './components/auth/Login';

const host = "http://127.0.0.1:5000"

function App() {
    const token = localStorage.getItem('token')

    const [url, setUrl] = React.useState({url: ""})
  return (
    <>
    {token ?
        <MainContent
            host={host}
            url={url}
            setUrl={setUrl}
        />
        :
        <Login
            host={host}
        />
    }
    </>
  );
}

export default App;
