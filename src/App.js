import logo from './logo.svg';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import React from 'react';
import MainContent from './components/MainContent';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import PrivateRoute from './components/auth/PrivateRoute';


function App() {
    const token = localStorage.getItem('token')

  return (
  <>
    <Routes>
        <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainContent />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
    </Routes>
    </>
  );
}

export default App;
