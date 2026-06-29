import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__illustration">
          <div className="not-found__orb not-found__orb--1" />
          <div className="not-found__orb not-found__orb--2" />
          <div className="not-found__orb not-found__orb--3" />
          <div className="not-found__error-code">404</div>
        </div>

        <h1 className="not-found__title">Page Not Found</h1>

        <p className="not-found__subtitle">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="not-found__actions">
          <button
            className="not-found__button"
            onClick={() => navigate("/home")}
          >
            Go Home
          </button>

          <button
            className="not-found__button not-found__button--secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound
;