// ===============================
// 📁 slides/MediaSlide.jsx
// ===============================

const MediaSlide = ({ slide }) => {
  return (
    <div className="media-slide">

      <img
        src={slide.image}
        alt="Publicidad"
        className="media-image"
      />

    </div>
  );
};

export default MediaSlide;