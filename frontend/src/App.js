import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddPhoto from './pages/AddPhoto';
import EditDelete from './pages/EditDelete';
import Category from './pages/Category';
import AddCategory from './pages/AddCategory';
import './styles/header.css';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (<>
        <title>PHOTO GALARY</title>
        <Router>
            <Header isLoggedIn={isLoggedIn} logout={logout} />
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/addphoto" element={isLoggedIn ? <AddPhoto /> : <Navigate to="/login" />} />
                <Route path="/addcategory" element={isLoggedIn ? <AddCategory /> : <Navigate to="/login" />} />
                <Route path="/editdelete" element={isLoggedIn ? <EditDelete /> : <Navigate to="/login" />} />
                <Route path="/category/:category" element={<Category />} />
            </Routes>
        </Router>
        </>);
};

export default App;
