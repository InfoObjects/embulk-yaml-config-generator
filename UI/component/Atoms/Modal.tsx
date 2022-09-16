import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

type Props = {
  title: string;
  children: any;
  show: boolean;
  onClose: () => void;
  size: "sm" | "lg" | "xl";
};

const Modals: React.FC<Props> = ({ title, children, show, onClose, size }) => {
  return (
    <>
      <Modal
        dialogClassName="my-modal"
        size={size}
        centered
        show={show}
        onHide={onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  );
};

export default Modals;
