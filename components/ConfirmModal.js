import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from '@/styles/Forum.module.css';


const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) return null;

    return (
        <div
            className={`modal fade show ${styles.modalBackdrop}`}
            id="deleteConfirmModal"
            tabIndex={-1}
            aria-labelledby="deleteConfirmModalLabel"
            aria-hidden="true"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-3 border-primary rounded-0 p-0">
                    <div className="modal-header text-bg-primary border-0 rounded-0">
                        <h1
                            className="modal-title fs-5 text-dark"
                            id="deleteConfirmModalLabel"
                        >
                            確認刪除
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onClose}
                        />
                    </div>

                    <div className="modal-body text-bg-dark text-primary">
                        <div className="row mt-4">
                            <div className="col-10 m-auto fw-bold text-center">
                                {message}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                        <div className="d-flex justify-content-center">
                            <button
                                type="button"
                                className="col-8 m-3 btn btn-secondary"
                                onClick={onClose}
                            >
                                取消
                                <div className="button__horizontal"></div>
                                <div className="button__vertical"></div>
                            </button>
                            <button
                                type="button"
                                className="col-8 m-3 btn btn-primary"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                刪除
                                <div className="button__horizontal"></div>
                                <div className="button__vertical"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;