import '../../../styles/treeLoader.css'

const TreeLoader = () => {
  return (
    <div className="rooted-loader">
      <div className="loader-scene">

        {/* Sun */}
        <div className="loader-sun">
          <span />
        </div>

        {/* Floating particles */}
        <span className="particle particle-1" />
        <span className="particle particle-2" />
        <span className="particle particle-3" />
        <span className="particle particle-4" />

        {/* Animated Plant */}
        <svg
          className="growing-tree"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil */}
          <ellipse
            cx="120"
            cy="202"
            rx="75"
            ry="13"
            fill="#D4A373"
            opacity=".35"
          />

          <path
            d="M45 202 Q120 190 195 202"
            stroke="#B87945"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Roots */}
          <g className="tree-roots">
            <path d="M120 192 Q104 207 96 211" />
            <path d="M120 192 Q136 207 145 211" />
            <path d="M120 192 L120 214" />
          </g>

          {/* Stem */}
          <path
            className="tree-stem"
            d="M120 195 C116 160 124 120 120 75"
            stroke="#1B4332"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Left Leaf */}
          <g className="leaf-left">
            <path
              d="M119 127 C82 128 67 99 78 76 C105 77 125 97 119 127Z"
              fill="#40916C"
            />
            <path
              d="M82 84 Q100 104 119 127"
              stroke="#D8F3DC"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Right Leaf */}
          <g className="leaf-right">
            <path
              d="M121 104 C126 70 154 56 174 69 C171 96 149 112 121 104Z"
              fill="#52B788"
            />
            <path
              d="M169 73 Q147 88 121 104"
              stroke="#D8F3DC"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Top Leaf */}
          <g className="leaf-top">
            <path
              d="M120 79 C99 55 109 31 120 23 C143 43 140 65 120 79Z"
              fill="#2D6A4F"
            />
            <path
              d="M120 27 L120 77"
              stroke="#D8F3DC"
              strokeWidth="2"
              fill="none"
            />
          </g>

          {/* Seed */}
          <ellipse
            className="tree-seed"
            cx="120"
            cy="194"
            rx="7"
            ry="9"
            fill="#B87945"
          />
        </svg>

        {/* Ground glow */}
        <div className="ground-glow" />

      </div>

      <div className="loader-content">
        <div className="brand-name">
          Rooted<span>In</span>
        </div>

        <h2>Every tree starts with a seed.</h2>

        <p>
          Nurturing your green journey...
        </p>

        <div className="loader-progress">
          <div />
        </div>

        <span className="loader-caption">
          GROWING A GREENER TOMORROW
        </span>
      </div>
    </div>
  );
};

export default TreeLoader;

