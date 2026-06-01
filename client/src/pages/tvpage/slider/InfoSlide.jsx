// ===============================
// 📁 slides/InfoSlide.jsx
// ===============================

const InfoSlide = ({ slide }) => {
  return (
    <div className="info-slide">

      <div className="info-box">

        <h1>
          {slide.title}
        </h1>

        <p>
          {slide.text}
        </p>

      </div>

    </div>
  );
};

export default InfoSlide;