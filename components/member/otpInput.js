import React, { useState, useEffect } from "react";

export default function OtpInput({
  value,
  onChange,
  onSendOtpCode,
  isSendingOtp,
  expiresTime,
  error,
}) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (expiresTime) {
      const now = new Date();
      const timeLeft = Math.floor((expiresTime - now) / 1000);
      setCountdown(timeLeft > 0 ? timeLeft : 0);

      const intervalId = setInterval(() => {
        setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [expiresTime]);

  useEffect(() => {
    if (countdown > 0) {
    }
  }, []);

  return (
    <div className="mb-3">
      <label htmlFor="verCode" className="form-label">
        驗證碼
      </label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="verCode"
          placeholder="輸入驗證碼"
          value={value}
          onChange={onChange}
          name="otp"
          autoComplete="off"
        />
        <button
          type="button"
          className="btn btn-outline-primary border"
          onClick={onSendOtpCode}
          disabled={isSendingOtp || countdown > 0}
        >
          {isSendingOtp
            ? "發送中..."
            : countdown > 0
            ? `倒數 ${countdown} 秒`
            : "發送"}
        </button>
      </div>
      {error && <div className="text-danger py-2">{error}</div>}
    </div>
  );
}
