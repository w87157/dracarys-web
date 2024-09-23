import React from 'react'

export default function DownloadModal({ show, status }) {
  if (!show) return null;
  // 下載中 及 下載完成的顯示
  return (
    <>
      <div className={`modal fade ${show ? 'show' : ''} `}
        style={{ display: show ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!show}>
        <div className="modal-dialog modal-dialog-centered" role="document" style={{ width: "20vw" }}>
          <div className="modal-content">
            <div className="modal-body">
              <p className="text-center mb-0 text-primary">{status}</p>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}