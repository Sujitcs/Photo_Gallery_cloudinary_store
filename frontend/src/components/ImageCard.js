import React from 'react';
import '../styles/imagecard.css';

const ImageCard = ({ image, onClick }) => {
    return (
        <div className="image-card" onClick={() => onClick(image)}>
            <img src={image.image} alt={image.name} /> {/* Use the direct URL from Cloudinary */}
        </div>
    );
};

export default ImageCard;