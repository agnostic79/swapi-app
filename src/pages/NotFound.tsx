import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-panel">
        <svg className="notfound-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" fill="none" stroke="var(--line)" strokeWidth="2" />
          <path
            d="M22 22l20 20M42 22l-20 20"
            fill="none"
            stroke="var(--amber)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <p className="notfound-code">404</p>
        <h1 className="notfound-title">Signal Not Found</h1>
        <p className="notfound-message">
          This route doesn't exist in the archive. It may have been moved or never recorded.
        </p>

        <Link to="/" className="notfound-link">
          ‹ Return to Terminal
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
