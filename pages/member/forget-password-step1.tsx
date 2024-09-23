import Link from "next/link";
import Image from "next/image";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";

import MemberLayout from "@/components/layout/member-layout";
import ProgressBar from "@/components/member/progress-bar";

import AutoCloseModal from "@/components/AutoCloseModalComponent";
import OtpInput from "@/components/member/otpInput";
import styles from "@/styles/Member.module.css";
import { emailIcon } from "@/asset/icon";

export default function ForgetPasswordStep1() {
  const router = useRouter();
  const { sendURLEmail } = useAuth();

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");

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

  const handleSendOtpCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setEmailError("電子信箱為必填");
      return;
    }

    setIsSendingOtp(true);
    try {
      const { success, message } = await sendURLEmail(emailInput);
      if (success) {
        // 跳轉到顯示成功發送郵件信息的頁面
        router.push("/member/forget-password-step2");
      } else {
        console.error(success, message);
        showAutoModal(message);
      }
    } catch (error) {
      console.error("發送驗證碼失敗:", error);
      showAutoModal("發送驗證碼失敗");
    } finally {
      setIsSendingOtp(false);
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
            <h2 className="text-center text-white">忘記密碼</h2>
            <ProgressBar currentStep={1} />
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className={`${styles.iconContainer}`}>
                <Image src={emailIcon} alt="" width={45} height={45} />
              </div>
            </div>
            <form onSubmit={handleSendOtpCode}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  要找回密碼的信箱
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="請輸入電子信箱"
                  name="email"
                  autoComplete="off"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && (
                  <div className="text-danger py-2">{emailError}</div>
                )}
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? `發送中...` : "發送"}
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div>
                </button>
              </div>
            </form>
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

ForgetPasswordStep1.getLayout = function (page: React.ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};
