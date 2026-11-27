import '../../styles/treeLoader.css'
const TreeLoader = () => {
  return (
    <div className="tree-loader">
      <div className="tree-animation">
        <span className="floating-leaf leaf-one">🍃</span>
        <span className="floating-leaf leaf-two">🍃</span>

        <div className="tree-icon">
          🌳
        </div>

        <div className="tree-ground"></div>
      </div>

      <h4>Growing Your Green Space</h4>

      <p>Preparing your RootedIn experience...</p>

      <div className="loader-track">
        <div className="loader-progress"></div>
      </div>

      <small>A little patience, a lot of growth 🌱</small>
    </div>
  );
};

export default TreeLoader;
