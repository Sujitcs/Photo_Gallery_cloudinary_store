import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/addcategory.css';

const url='https://photo-gallery-cloudinary.onrender.com';

const AddCategory = () => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState(null);
    const [updatedName, setUpdatedName] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error('No token found, please log in.');
            return;
        }

        try {
            await axios.post(url +'/api/add', { name }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Category added successfully');
            setName('');
            window.location.reload();
            // Refresh categories list
            const response = await axios.get(url +'/api/list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            toast.error('Failed to add category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(url +`/api/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Category deleted successfully');
            setCategories(categories.filter(category => category._id !== id));
            window.location.reload();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleEdit = (category) => {
        setEditCategory(category);
        setUpdatedName(category.name);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(url +`/api/edit/${editCategory._id}`, { name: updatedName }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success('Category updated successfully');
            setCategories(categories.map(category => category._id === editCategory._id ? { ...category, name: updatedName } : category));
            setEditCategory(null);
            setUpdatedName('');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update category');
        }
    };

    return (
        <div className="add-category-page">
            <h1>Add or Manage Categories</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    required
                />
                <button type="submit">Add Category</button>
            </form>

            {editCategory && (
                <div className="edit-category-modal">
                    <div className="edit-category-content">
                        <h3>Edit Category</h3>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="New Category Name"
                        />
                        <button onClick={handleUpdate}>Save Changes</button>
                        <button onClick={() => setEditCategory(null)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="category-list">
                {categories.map((category) => (
                    <div className="category-item" key={category._id}>
                    <span>{category.name}</span>
                    <div className="category-item-buttons">
                        <button onClick={() => handleEdit(category)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(category._id)}>Delete</button>
                    </div>
                </div>
                
                ))}
            </div>
        </div>
    );
};

export default AddCategory;
