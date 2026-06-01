// ===============================
// 📁 slides/TeamSlide.jsx
// ===============================

const TeamSlide = ({ slide }) => {
  return (
    <div className="team-slide">

      <img
        src={slide.image}
        alt="Compañerismo"
        className="team-bg"
      />

      <div className="team-overlay"></div>

      <div className="team-content">

        <div className="team-small-title">
          {slide.smallTitle}
        </div>

        <h1>
          {slide.title}
        </h1>

        <h2>
          {slide.subtitle}
        </h2>

        <div className="team-phrase">
          {slide.phrase}
        </div>

        <div className="team-values">

          <div className="team-value">
            <span>🤝</span>

            <h3>Compañerismo</h3>

            <p>
              Nos apoyamos y crecemos juntos.
            </p>
          </div>

          <div className="team-value">
            <span>🎯</span>

            <h3>Esfuerzo</h3>

            <p>
              Cada paso nos acerca a la meta.
            </p>
          </div>

          <div className="team-value">
            <span>⭐</span>

            <h3>Disciplina</h3>

            <p>
              La constancia nos hace fuertes.
            </p>
          </div>

          <div className="team-value">
            <span>🏆</span>

            <h3>Metas</h3>

            <p>
              Lo logramos como equipo.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TeamSlide;