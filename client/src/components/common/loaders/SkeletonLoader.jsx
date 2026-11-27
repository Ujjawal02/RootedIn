
import '../../../styles/SkeletonLoader.css';

const SkeletonLoader = ({
  type = 'tree-card',
  count = 3,
}) => {

  const items = Array.from({ length: count });

  if (type === 'tree-card') {
    return (
      <div className="skeleton-grid">
        {items.map((_, index) => (
          <div className="skeleton-tree-card" key={index}>
            <div className="skeleton-shimmer skeleton-tree-image" />

            <div className="skeleton-tree-content">
              <div className="skeleton-shimmer skeleton-title" />
              <div className="skeleton-shimmer skeleton-subtitle" />

              <div className="skeleton-tree-footer">
                <div className="skeleton-shimmer skeleton-price" />
                <div className="skeleton-shimmer skeleton-button" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="skeleton-stat-grid">
        {items.map((_, index) => (
          <div className="skeleton-stat-card" key={index}>
            <div className="skeleton-shimmer skeleton-stat-icon" />
            <div className="skeleton-shimmer skeleton-stat-number" />
            <div className="skeleton-shimmer skeleton-stat-label" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className="skeleton-profile">
        <div className="skeleton-shimmer skeleton-avatar" />
        <div className="skeleton-profile-info">
          <div className="skeleton-shimmer skeleton-title" />
          <div className="skeleton-shimmer skeleton-subtitle" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {items.map((_, index) => (
          <div className="skeleton-list-item" key={index}>
            <div className="skeleton-shimmer skeleton-list-image" />

            <div className="skeleton-list-content">
              <div className="skeleton-shimmer skeleton-title" />
              <div className="skeleton-shimmer skeleton-subtitle" />
              <div className="skeleton-shimmer skeleton-short-line" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
