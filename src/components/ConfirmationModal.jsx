import React from "react";

const ConfirmationModal = ({ isOpen, message, onClose }) => {
  return (
    <div className={`confirm-modal ${isOpen ? "active" : ""}`}>
      <div className="confirm-modal-content">
        <p>{message}</p>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;