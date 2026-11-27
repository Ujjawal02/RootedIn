
import '../../../styles/PageLoader.css';

const PageLoader = ({
  message = 'Growing something beautiful',
  subMessage = 'Please wait while we prepare your garden...',
}) => {
  return (
    <div className="page-loader">
      <div className="page-loader-visual">

        <div className="page-loader-glow" />

        <svg
          className="page-loader-plant"
          viewBox="0 0 180 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground */}
          <ellipse
            cx="90"
            cy="125"
            rx="43"
            ry="8"
            fill="#D4A373"
            opacity=".3"
          />

          {/* Stem */}
          <path
            className="page-stem"
            d="M90 120 Q87 78 90 35"
            stroke="#1B4332"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Left leaf */}
          <g className="page-leaf page-leaf-left">
            <path
              d="M89 90 Q47 90 47 53 Q76 43 89 90Z"
              fill="#40916C"
            />
            <path
              d="M50 55 Q70 69 89 90"
              stroke="#D8F3DC"
              strokeWidth="1.5"
            />
          </g>

          {/* Right leaf */}
          <g className="page-leaf page-leaf-right">
            <path
              d="M91 69 Q100 29 133 30 Q139 58 91 69Z"
              fill="#52B788"
            />
            <path
              d="M132 32 Q111 49 91 69"
              stroke="#D8F3DC"
              strokeWidth="1.5"
            />
          </g>

          {/* Top leaf */}
          <g className="page-leaf page-leaf-top">
            <path
              d="M90 36 Q70 13 90 7 Q111 19 90 36Z"
              fill="#2D6A4F"
            />
          </g>
        </svg>

        {/* Floating particles */}
        <span className="page-particle particle-a" />
        <span className="page-particle particle-b" />
        <span className="page-particle particle-c" />

      </div>

      <div className="page-loader-text">
        <h5>{message}</h5>
        <p>{subMessage}</p>
      </div>

      <div className="page-loader-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default PageLoader;
