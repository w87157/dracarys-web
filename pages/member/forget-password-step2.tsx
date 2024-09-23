import Link from "next/link";
import Image from "next/image";

import React, { useEffect } from "react";

import MemberLayout from "@/components/layout/member-layout";
import ProgressBar from "@/components/member/progress-bar";
import styles from "@/styles/Member.module.css";
import { verCodeIcon } from "@/asset/icon";

export default function ForgetPasswordStep2() {
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
            <h2 className="text-center text-white">信件已發送</h2>
            <ProgressBar currentStep={2} />
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className={`${styles.iconContainer}`}>
                <Image src={verCodeIcon} alt="" width={45} height={45} />{" "}
              </div>
            </div>
            <p className="text-white">
              請檢查您的信箱並點擊郵件中的連結以完成密碼重設。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

ForgetPasswordStep2.getLayout = function (page: React.ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};
