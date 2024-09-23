import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const AutoCloseModal = ({ show, onClose, message }) => {
  const [count, setCount] = useState(0.1);

  useEffect(() => {
    let timer;
    if (show) {
      // 每秒更新一次倒計時
      timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 0) {
            clearInterval(timer);
            onClose();
            return 0.1; // 重置倒計時
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    // 清理函數
    return () => clearInterval(timer);
  }, [show, onClose]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="h-100 d-flex align-items-center modal-sm justify-content-center"
    >
      <div className="modal-content border-0 rounded-0">
        <div className="modal-body text-bg-dark text-primary">
          <div className="row">
            <div className="col-12 m-auto fw-bold d-flex justify-content-center px-5">
              {message}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AutoCloseModal;
