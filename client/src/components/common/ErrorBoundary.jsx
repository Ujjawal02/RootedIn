import React from 'react'

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-5">
          <h2>Something went wrong</h2>
          <p className="text-muted">Please refresh the page. If it keeps happening, try again later.</p>
          <button className="btn btn-success" onClick={() => window.location.assign('/')}>
            Go to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary