import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaBars } from 'react-icons/fa';
import axios from 'axios';
import '../styles/header.css';

const url='https://photo-gallery-cloudinary.onrender.com';

const Header = ({ isLoggedIn, logout }) => {
    const [categories, setCategories] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(url +'/api/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories');
            }
        };

        fetchCategories();
    }, [token]);

    // Toggle menu visibility
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close the menu when a link is clicked
    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-left">
                <span role="img" aria-label="camera">📸</span>
            </div>
            
            <button className="hamburger" onClick={toggleMenu}>
                <FaBars />
            </button>
            
            <nav className={`header-right ${menuOpen ? 'open' : ''}`}> {/* Apply open class when menu is open */}
                <Link to="/" onClick={closeMenu}>Home</Link>

                {/* Category Dropdown */}
                <div className="dropdown">
                    <button className="dropbtn">Categories</button>
                    <div className="dropdown-content">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <Link key={category._id} to={`/category/${category.name}`} onClick={closeMenu}>
                                    {category.name}
                                </Link>
                            ))
                        ) : (
                            <span>No categories available</span>
                        )}
                    </div>
                </div>

                {!isLoggedIn ? (
                    <Link to="/login" onClick={closeMenu}>Login</Link>
                ) : (
                    <>
                        <Link to="/addphoto" onClick={closeMenu}>Add Photo</Link>
                        <Link to="/addcategory" onClick={closeMenu}>Add Categories</Link>
                        <Link to="/editdelete" onClick={closeMenu}>Edit/Delete</Link>
                        <button onClick={() => { closeMenu(); logout(); }}>Logout</button>
                    </>
                )}
                <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" onClick={closeMenu}>
            <FaInstagram className="social-icon" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" onClick={closeMenu}>
            <FaFacebook className="social-icon" />
        </a>
    </div>
            </nav>
        </header>
    );
};

export default Header;
