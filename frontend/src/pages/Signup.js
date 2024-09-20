import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/signup.css';

const url='https://photo-gallery-cloudinary.onrender.com';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     document.title = 'Signup Page';
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(url +'/api/signup', { name, email, password });
            toast.success('Signup successful');
            navigate('/login');
        } catch (error) {
            toast.error('Signup failed');
        }
    };

    return (
        <div className="signup-page">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
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
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
