import React, { useState } from 'react';
import './ArtefactImage.css';

const ArtefactImage = ({ 
  imageUrl, 
  title, 
  className = '', 
  containerClassName = '',
  showContainer = true,
  dimensions = { width: '100%', height: '250px' }
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', imageUrl);
    setImageError(true);
    setImageLoading(false);
    e.target.onerror = null;
    e.target.src = '/default-artefact.png';
  };

  const imageElement = (
    <img
      src={imageUrl ? `http://localhost:5000/uploads/${imageUrl}` : '/default-artefact.png'}
      alt={title || 'Artefact'}
      className={`artefact-image ${className}`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{
        ...dimensions,
        objectFit: 'cover',
        display: 'block'
      }}
    />
  );

  if (!showContainer) {
    return imageElement;
  }

  return (
    <div 
      className={`artefact-image-container ${containerClassName} ${imageLoading ? 'artefact-image-loading' : ''} ${imageError ? 'artefact-image-error' : ''}`}
      style={{ height: dimensions.height }}
    >
      {imageElement}
    </div>
  );
};

export default ArtefactImage; 