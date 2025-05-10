import React from "react";
import "../styles/TranslatorItem.css";

function TranslatorItem({ translator, isSelected, onSelect }) {
  const handleClick = () => {
    onSelect(translator.id);
  };

  return (
    <div
      className={`translator-item ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      {translator.name}
    </div>
  );
}

export default TranslatorItem;
