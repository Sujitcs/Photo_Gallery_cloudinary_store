import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/homepage.css';

const url = 'https://photo-gallery-cloudinary.onrender.com';

const Home = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(url + '/api/getimage');
                setImages(response.data);
            } catch (error) {
                toast.error('Failed to load images');
            }
        };
        fetchImages();
    }, []);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="home-page">
            {images.map((image) => (
                <ImageCard key={image._id} image={image} onClick={() => handleImageClick(image)} />
            ))}
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

export default Home;
