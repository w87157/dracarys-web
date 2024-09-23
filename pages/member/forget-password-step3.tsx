import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import AutoCloseModal from "@/components/AutoCloseModalComponent";
import MemberLayout from "@/components/layout/member-layout";
import ProgressBar from "@/components/member/progress-bar";
import styles from "@/styles/Member.module.css";
import { unlockIcon } from "@/asset/icon";

export default function ForgetPasswordStep3() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto Close Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showAutoModal = (message: string) => {
    setMessage(message);
    setModalVisible(true);
  };

  const closeAutoModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;

      try {
        const response = await fetch(
          "http://localhost:8080/member/verify-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const result = await response.json();
        if (result.success) {
          setIsTokenValid(true);
        } else {
          setError(result.message || "驗證連結無效或已過期");
        }
      } catch (error) {
        setError("發生錯誤，請稍後再試");
      }
    };

    verifyToken();
  }, [token]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("密碼與確認密碼不匹配");
      return;
    }

    if (!isTokenValid) {
      setError("Token 驗證失敗");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/member/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      const result = await response.json();
      if (result.success) {
        showAutoModal("重設密碼成功");
        setTimeout(() => router.push("/"), 1200);
      } else {
        setError(result.message || "密碼重設失敗");
      }
    } catch (error) {
      setError("發生錯誤，請稍後再試");
    }
  };

  useEffect(() => {
    document.title = "忘記密碼 | Dragonfire & Sorcery";
  }, []);

  return (
    <div className="w-100">
      <div className="container">
        <div className="row">
          <div
            className={`col-10 col-md-5 mx-auto p-5 ${styles["bg-dark-transparent"]}`}
          >
            <h2 className="text-center text-white">重設密碼</h2>
            <ProgressBar currentStep={3} />
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className={`${styles.iconContainer}`}>
                <Image src={unlockIcon} alt="" width={45} height={45} />{" "}
              </div>
            </div>
            {isTokenValid ? (
              <form onSubmit={handlePasswordReset}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    請設定難度較高的密碼
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="輸入你的密碼"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
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
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    確認密碼
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      placeholder="再次輸入你的密碼"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className={`btn ${
                        showConfirmPassword
                          ? "btn-success border"
                          : "btn-outline-primary border"
                      }`}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "隱藏確認密碼" : "顯示確認密碼"
                      }
                    >
                      {showConfirmPassword ? "隱藏" : "顯示"}
                    </button>
                  </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    完成
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                </div>
              </form>
            ) : (
              <div className="alert alert-danger">操作失敗</div>
            )}
          </div>
        </div>
      </div>
      <AutoCloseModal
        show={isModalVisible}
        onClose={closeAutoModal}
        message={message}
      />
    </div>
  );
}

ForgetPasswordStep3.getLayout = function (page: React.ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};
