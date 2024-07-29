import React, { useState, useEffect } from 'react';
import './user.css';

const Users = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const images = [
    '/DSC06247.JPG',
    '/DSC06257.JPG',
    '/DSC06259.JPG',
    // Agrega más imágenes aquí
  ];

  useEffect(() => {
    const preloadImages = (imageArray) => {
      const promises = imageArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
      Promise.all(promises)
        .then(() => setImagesLoaded(true))
        .catch((err) => console.error("Error loading images", err));
    };

    preloadImages(images);
  }, [images]);

  useEffect(() => {
    if (imagesLoaded) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images.length, imagesLoaded]);

  return (
    <div className="users-container">
      <div className="slideshow">
        <div className="slideshow-text">
          <h1>Colegio Panamericano Colombo Sueco</h1>
          <p>30 Años formando líderes en Cristo para Colombia y las naciones</p>
        </div>
        {imagesLoaded ? (
          images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentImageIndex ? 'active' : ''}`}
            >
              <img src={image} alt={`Slide ${index}`} />
            </div>
          ))
        ) : (
          <div className="loading">Cargando imágenes...</div>
        )}
      </div>
      <section className="cards">
        <div className="card">
          <img src="/DSC06282.JPG" alt="Image 1" />
          <h3>Card Title 1</h3>
          <p>Card description 1</p>
        </div>
        <div className="card">
          <img src="/DSC06286.JPG" alt="Image 2" />
          <h3>Card Title 2</h3>
          <p>Card description 2</p>
        </div>
        <div className="card">
          <img src="/DSC06302.JPG" alt="Image 3" />
          <h3>Card Title 3</h3>
          <p>Card description 3</p>
        </div>
      </section>
    </div>
  );
};

export default Users;
