import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ImageCard from '../components/ImageCard';
import { toast } from 'react-toastify';
import '../styles/category.css';

const url = 'https://photo-gallery-cloudinary.onrender.com';

const Category = () => {
    const { category } = useParams();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImagesByCategory = async () => {
            try {
                const response = await axios.get(url + `/api/getimage/${category}`);
                setImages(response.data);
            } catch (error) {
                toast.error(`Failed to load images for category: ${category}`);
                
            }
        };
        fetchImagesByCategory();
    }, [category]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="category-page">
            <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)} Images</h2>
            <div className="image-grid">
                {images.length > 0 ? (
                    images.map((image) => (
                        <ImageCard key={image._id} image={image} onClick={() => handleImageClick(image)} />
                    ))
                ) : (
                    <p>No images found for this category.</p>
                )}
            </div>
            {selectedImage && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <div className="modal-body">
                            <img
                                src={selectedImage.image} // Use the direct URL from Cloudinary
                                alt={selectedImage.name}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;
