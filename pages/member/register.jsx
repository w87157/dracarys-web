import React, { useRef, useEffect } from "react";

import MemberLayout from "@/components/layout/member-layout";
import RegForm from "@/components/member/register-form";

import styles from "@/styles/Member.module.css";

export default function Register() {
  const formRef = useRef(null);

  useEffect(() => {
    document.title = "帳號註冊 | Dragonfire & Sorcery";
  }, []);

  const handleAutoFill = () => {
    if (formRef.current) {
      formRef.current.handleFillForm();
    }
  };

  return (
    <>
      <div className="w-100">
        <div className="container">
          <div className="row">
            <div
              className={`col-10 col-md-5 mx-auto p-5 ${styles["bg-dark-transparent"]}`}
            >
              <h2 className="text-center text-white">帳號註冊</h2>
              <RegForm ref={formRef} />
            </div>
          </div>
        </div>
      </div>
      <button className={styles.fixedButton} onClick={handleAutoFill}></button>
    </>
  );
}

Register.getLayout = function (page) {
  return <MemberLayout>{page}</MemberLayout>;
};
