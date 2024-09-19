import React, { useState, useEffect } from 'react';
import './user.css';
import Footer from '../footer/Footer';

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
    <>
   
    <div className="users-container">
      {/* <div className="slideshow">
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
      </div> */}
      <div className='card-title'>
        <h2>¿Hola equipo, esto te puede ayudar para el informe académico! </h2>

      </div>
      <section className="cards">
        <div className="card">
          <h3>Primer paso : <span className='card-tema'>Reporte académico</span> </h3>
          <p>Luego de ingresar a la plataforma dirígete a académico - reporte Académico</p>
          <img src="/1_paso.png" alt="Image 1" />
        </div>
        <div className="card">
          <h3>Segundo paso: <span className='card-tema'>Estadísticas generales</span> </h3>
          <p>Si eres director de grupo dirígete a estadísticas generales y allí puedes filtrar según tus necesidades.</p>
          <img src="/2_paso.png" alt="Image 2" />
        </div>
        <div className="card">
          <h3>Tercer paso: <span className='card-tema'>Observaciones generales</span></h3>
          <p>Como director de grupo puedes visualizar y editar en la parte inferior las observaciones generales de grupo.</p>
          <img src="/3_paso.png" alt="Image 3" />
        </div>
        <div className="card">
          <h3>Cuarto paso:<span className='card-tema'>Docente área</span> </h3>
          <p>Dirigente a estadísticas por área y allí puedes filtrar según tus necesidades.</p>
          <img src="/4_paso.png" alt="Image 3" />
        </div>
        <div className="card">
          <h3>Quinto paso:<span className='card-tema'>Observaciones, metas y reporte evaluación</span> </h3>
          <p>Allí en acciones puedes editar cada parámetro de forma individual.</p>
          <img src="/5_paso.png" alt="Image 3" />
        </div>
      </section>
      
    </div>
    <div>
      <Footer />
    </div>
    </>
  );
};

export default Users;
