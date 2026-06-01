import { useEffect, useState } from "react";
import "./Digital_Signage_TV.css";

import TeamSlide from "./slider/TeamSlide";
import MediaSlide from "./slider/MediaSlide";
import InfoSlide from "./slider/InfoSlide";
import VideoSlide from "./slider/VideoSlide";

const Digital_Signage_TV = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetch("/data/tv-slides.json");
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error("Error cargando slides:", error);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const slide = slides[currentSlide];

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slide.duration || 15000);

    return () => clearTimeout(timer);
  }, [slides, currentSlide]);

  if (slides.length === 0) {
    return (
      <div className="tv-screen">
        <h1>Cargando contenido...</h1>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="tv-screen">
      {slide.type === "team" && <TeamSlide slide={slide} />}
      {slide.type === "image" && <MediaSlide slide={slide} />}
      {slide.type === "video" && <VideoSlide slide={slide} />}
      {slide.type === "info" && <InfoSlide slide={slide} />}

      <div className="tv-footer">
        <span>CPCS Intranet</span>
        <span>{new Date().toLocaleDateString("es-CO")}</span>
      </div>
    </div>
  );
};

export default Digital_Signage_TV;