import React from 'react';
import '../styles/imagecard.css';

const ImageCard = ({ image, onClick }) => {
    return (
        <div className="image-card" onClick={() => onClick(image)}>
            <img src={image.image} alt={image.name} />
        </div>
    );
};

export default ImageCard;
