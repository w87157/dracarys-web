import React, { useImperativeHandle, useState, forwardRef } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import OtpInput from "@/components/member/otpInput";
import GoogleLogin from "@/components/member/google-login";
import styles from "@/styles/Member.module.css";

const RegisterForm = forwardRef((props, ref) => {
  const [user, setUser] = useState({
    login: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    login: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const router = useRouter();
  const { register, sendOtpCode } = useAuth();

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expiresTime, setExpiresTime] = useState(null);

  useImperativeHandle(ref, () => ({
    handleFillForm: () => {
      setUser({
        login: "player",
        email: "",
        name: "王小明",
        password: "123456",
        confirmPassword: "123456",
        otp: "",
      });
    },
  }));

  const showAutoModal = (message) => {
    setMessage(message);
    setModalVisible(true);
  };

  const closeAutoModal = () => {
    setModalVisible(false);
  };

  const handleFieldChange = (e) => {
    const fieldName = e.target.name;
    setUser({ ...user, [fieldName]: e.target.value });

    setErrors({ ...errors, [fieldName]: "" });
  };

  const handleSendOtpCode = async () => {
    if (!user.email) {
      setErrors({ ...errors, email: "電子信箱為必填" });
      return;
    }

    setIsSendingOtp(true);
    try {
      const { success, message, expires_time } = await sendOtpCode(user.email);
      if (success) {
        showAutoModal(message);
        setExpiresTime(new Date(expires_time)); // 設置到期時間
        return true; // 發送成功
      } else {
        showAutoModal(message);
        return false; // 發送失敗
      }
    } catch (error) {
      console.error("發送驗證碼失敗:", error);
      showAutoModal("發送驗證碼失敗");
      return false; // 發送失敗
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      login: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    };

    if (!user.login) {
      newErrors.login = "帳號為必填";
    }
    if (!user.name) {
      newErrors.name = "暱稱為必填";
    }
    if (!user.email) {
      newErrors.email = "電子信箱為必填";
    }
    if (user.password !== user.confirmPassword) {
      newErrors.password = "密碼與確認密碼需要一致";
      newErrors.confirmPassword = "密碼與確認密碼需要一致";
    }

    if (!user.password) {
      newErrors.password = "密碼為必填";
    }

    if (!user.confirmPassword) {
      newErrors.confirmPassword = "確認密碼為必填";
    }

    if (!user.otp) {
      newErrors.otp = "驗證碼為必填";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((v) => v);
    if (hasErrors) {
      console.log(newErrors);
      return;
    }

    const { success, message } = await register(
      user.login,
      user.email,
      user.name,
      user.password,
      user.otp
    );
    if (success) {
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }
    showAutoModal(message);
  };

  return (
    <>
      <form onSubmit={handleRegisterSubmit}>
        <div className="mb-3">
          <label htmlFor="r-login" className="form-label">
            帳號
          </label>
          <input
            type="text"
            className="form-control"
            id="r-login"
            placeholder="輸入遊戲帳號"
            value={user.login}
            onChange={handleFieldChange}
            name="login"
            autoComplete="off"
          />
          {errors.login && (
            <div className="text-danger py-2">{errors.login}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            暱稱
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="輸入帳號暱稱"
            value={user.name}
            onChange={handleFieldChange}
            name="name"
            autoComplete="off"
          />
          {errors.name && <div className="text-danger py-2">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            電子信箱
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="輸入電子信箱"
            value={user.email}
            onChange={handleFieldChange}
            name="email"
            autoComplete="off"
          />
          {errors.email && (
            <div className="text-danger py-2">{errors.email}</div>
          )}
        </div>
        <OtpInput
          value={user.otp}
          onChange={handleFieldChange}
          onSendOtpCode={handleSendOtpCode}
          isSendingOtp={isSendingOtp}
          expiresTime={expiresTime}
          error={errors.otp}
        />
        <div className="mb-3">
          <label htmlFor="r-password" className="form-label">
            密碼
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="r-password"
              placeholder="輸入遊戲密碼"
              value={user.password}
              onChange={handleFieldChange}
              name="password"
              autoComplete="off"
            />
            <button
              type="button"
              className={`btn ${
                showPassword
                  ? "btn-success border"
                  : "btn-outline-primary border"
              }`}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
            >
              {showPassword ? "隱藏" : "顯示"}
            </button>
          </div>
          {errors.password && (
            <div className="text-danger py-2">{errors.password}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">
            確認密碼
          </label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              placeholder="再次輸入遊戲密碼"
              value={user.confirmPassword}
              onChange={handleFieldChange}
              name="confirmPassword"
              autoComplete="off"
            />
            <button
              type="button"
              className={`btn ${
                showConfirmPassword
                  ? "btn-success border"
                  : "btn-outline-primary border"
              }`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "隱藏確認密碼" : "顯示確認密碼"}
            >
              {showConfirmPassword ? "隱藏" : "顯示"}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-danger py-2">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="mb-4 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            註冊
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-center mb-4">
        <span className="align-middle text-white">已有帳號？</span>
        <Link
          className="text-primary"
          href="#/"
          data-bs-toggle="modal"
          data-bs-target="#memberModal"
        >
          立即登入
        </Link>
      </div>
      <div className="row d-flex justify-content-center">
        <div
          className={`col-12 d-flex mb-2 justify-content-center text-secondary ${styles["text-line"]}`}
        >
          <h6>更多登入方式</h6>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <GoogleLogin showAutoModal={showAutoModal} />
        </div>
      </div>

      <AutoCloseModal
        show={isModalVisible}
        onClose={closeAutoModal}
        message={message}
      />
    </>
  );
});

RegisterForm.displayName = "RegisterForm";

export default RegisterForm;
