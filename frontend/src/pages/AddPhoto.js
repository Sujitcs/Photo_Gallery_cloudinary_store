import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/addphoto.css';
import { url } from '../components/Base_url';

const AddPhoto = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${url}/api/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, [token]);

    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please select at least one image.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        for (let img of images) {
            if (!validTypes.includes(img.type)) {
                toast.error('Only JPEG (JPG) and PNG files are accepted!');
                return;
            }
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);

        // Append all selected images to formData
        images.forEach((img) => {
            formData.append('images', img); // Update to match backend expectation
        });

        if (!token) {
            toast.error('No token found, please log in.');
            return;
        }

        try {
            await axios.post(`${url}/api/addimage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Images uploaded successfully');
            setName('');
            setCategory('');
            setImages([]);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized: Invalid or missing token.');
            } else {
                toast.error('Failed to upload images');
            }
        }
    };

    return (
        <div className="add-photo-page">
            <form onSubmit={handleImageUpload}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Image Name"
                    required
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/jpeg, image/jpg, image/png"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                    required
                />
                <button type="submit">Upload Photos</button>
            </form>
        </div>
    );
};

export default AddPhoto;
