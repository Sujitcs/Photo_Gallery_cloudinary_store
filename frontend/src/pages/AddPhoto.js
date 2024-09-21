import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/addphoto.css';
import { url } from '../components/Base_url';

const AddPhoto = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]); // Update state to handle multiple files
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(url + '/api/list', {
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

        // Check if images are selected and all of them are valid types
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

        // Append all selected images to the formData
        images.forEach((img, index) => {
            formData.append('image', img); // Note: 'image' is the same as in the backend multer config
        });

        if (!token) {
            toast.error('No token found, please log in.');
            return;
        }

        try {
            await axios.post(url + '/api/addimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Images uploaded successfully');
            setName('');
            setCategory('');
            setImages([]); // Reset the images state after successful upload
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
                    multiple // Allow multiple file selection
                    onChange={(e) => setImages([...e.target.files])} // Store selected files in state
                    required
                />
                <button type="submit">Upload Photos</button>
            </form>
        </div>
    );
};

export default AddPhoto;
