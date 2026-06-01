// ===============================
// 📁 slides/VideoSlide.jsx
// ===============================

const VideoSlide = ({ slide }) => {
  return (
    <div className="video-slide">

      <video
        className="video-player"
        autoPlay
        muted
        loop
      >
        <source src={slide.video} type="video/mp4" />
      </video>

    </div>
  );
};

export default VideoSlide;