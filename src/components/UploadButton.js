import React from "react";
import { ReactComponent as Upload } from "../assets/icons/upload.svg";
import "../styles/UploadButton.css";

function UploadButton() {
  return (
    <div>
      <div className="upload-button-container">
        <Upload className="upload-button-icon"></Upload>
        <span className="upload-button-text">Upload</span>
      </div>
    </div>
  );
}

export default UploadButton;
