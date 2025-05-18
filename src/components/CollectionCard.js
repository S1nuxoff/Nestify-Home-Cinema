import React from "react";
import "../styles/VideoCard.css";
import config from "../core/config";
import { useNavigate } from "react-router-dom";

function CollectionCard({ collection }) {
  const navigate = useNavigate();
  return (
    <div
      className="video-card-container"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/category/${collection.navigate_to}`);
      }}
    >
      <div className="video-card-preview-wrapper">
        <img
          src={`${config.backend_url}${collection.local_url}`}
          alt="collection"
          className="video-card_preview-image"
        />
      </div>
    </div>
  );
}

export default CollectionCard;
