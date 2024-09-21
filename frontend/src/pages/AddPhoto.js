import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/addphoto.css';
import { url } from '../components/Base_url';

const AddPhoto = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

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
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, [token]);

    const handleImageUpload = async (e) => {
        e.preventDefault();

        
        if (image && !['image/jpeg','image/jpg', 'image/png'].includes(image.type)) {
            toast.error('Only JPEG(JPG) and PNG files are accepted!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('image', image);

        if (!token) {
            toast.error('No token found, please log in.');
            return;
        }

        try {
            await axios.post(url +'/api/addimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            toast.success('Image uploaded successfully');
            setName('');
            setCategory('');
            setImage(null);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized: Invalid or missing token.');
            } else {
                toast.error('Failed to upload image');
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
                    accept="image/jpeg,image/jpg, image/png"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />
                <button type="submit">Upload Photo</button>
            </form>
        </div>
    );
};

export default AddPhoto;
