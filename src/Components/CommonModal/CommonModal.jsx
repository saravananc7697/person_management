import React from "react";
import { Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonModal = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-overlay">
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </IconButton>
        {children}
      </div>
    </Modal>
  );
};

export default CommonModal;
