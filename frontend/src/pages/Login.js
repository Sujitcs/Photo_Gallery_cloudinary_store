import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/login.css';

const url='http://localhost:5000';

const Login = ({ setIsLoggedIn }) => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     document.title = 'Login Page';
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url +'/api/signin', { email, password });
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            toast.error('Login failed');
        }
    };
    

    return (
        <div className="login-page">
            
            <h2>Only Admin can login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
