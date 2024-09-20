import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/editdelete.css';

const url = 'https://photo-gallery-cloudinary.onrender.com';

const EditDelete = () => {
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editImage, setEditImage] = useState(null);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedCategory, setUpdatedCategory] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(url + '/api/getimage', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setImages(response.data);
            } catch (error) {
                toast.error('Failed to load images');
                
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(url + '/api/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                toast.error('Failed to load categories');
                
            }
        };

        fetchImages();
        fetchCategories();
    }, [token]);

    const handleDelete = async (imageId) => {
        try {
            await axios.delete(url + `/api/deleteimage/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setImages(images.filter((image) => image._id !== imageId));
            toast.success('Image deleted successfully');
        } catch (error) {
            toast.error('Failed to delete image');
            
        }
    };

    const handleEdit = (image) => {
        setEditImage(image);
        setUpdatedName(image.name);
        setUpdatedCategory(image.category);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(url + `/api/editimage/${editImage._id}`, {
                name: updatedName,
                category: updatedCategory,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update the image in the state
            setImages(images.map((img) => (img._id === editImage._id ? { ...img, name: updatedName, category: updatedCategory } : img)));
            toast.success('Image updated successfully');
            setEditImage(null); // Close the modal
        } catch (error) {
            toast.error('Failed to update image');
            
        }
    };

    return (
        <div className="edit-delete-page">
            {images.map((image) => (
                <div key={image._id} className="edit-delete-card">
                    <img src={image.image} alt={image.name} /> {/* Use the direct URL from Cloudinary */}
                    <h3>{image.name}</h3>
                    <p>{image.category}</p>
                    <button onClick={() => handleEdit(image)}>Edit</button>
                    <button onClick={() => handleDelete(image._id)}>Delete</button>
                </div>
            ))}
            {/* Modal for editing */}
            {editImage && (
                <div className="editmodal">
                    <div className="editmodal-content">
                        <h3>Edit Image</h3>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Image Name"
                        />
                        <select
                            value={updatedCategory}
                            onChange={(e) => setUpdatedCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleUpdate}>Save Changes</button>
                        <button onClick={() => setEditImage(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditDelete;
