
import '../../../styles/ButtonLoader.css';

const ButtonLoader = ({
  text = 'Processing...',
  light = false,
}) => {
  return (
    <span className={`button-loader ${light ? 'light' : ''}`}>
      <svg
        className="button-loader-icon"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stem */}
        <path
          d="M20 30 Q18 20 20 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Left leaf */}
        <path
          className="button-leaf left"
          d="M19 22 Q7 22 8 12 Q17 11 19 22Z"
          fill="#52B788"
        />

        {/* Right leaf */}
        <path
          className="button-leaf right"
          d="M21 17 Q23 6 33 8 Q33 17 21 17Z"
          fill="#95D5B2"
        />

        {/* Soil */}
        <path
          d="M12 31 Q20 27 28 31"
          stroke="#D4A373"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <span>{text}</span>
    </span>
  );
};

export default ButtonLoader;
