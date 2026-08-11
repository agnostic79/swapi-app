import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" role="status" aria-label="Loading">
        <div className="loading-ring" />
      </div>
      <p className="loading-text">Retrieving records...</p>
    </div>
  );
}

export default LoadingSpinner;
