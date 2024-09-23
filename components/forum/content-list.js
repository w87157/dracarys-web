import React from "react";
import styles from "@/styles/Forum.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ContentList() {
  return (
    <>
      {/* 1st */}
      <div className={`row mt-5 mb-3`}>
        {/* pic */}
        <div className={`col-12 col-md-3 d-flex justify-content-center`}>
          <Image
            className={`w-100`}
            width={190}
            height={130}
            src="/forum/b00k.jpg"
            alt="..." />
        </div>
        {/* article */}
        <div className={`col-12 col-md-9`}>
          <Link href="/forum/news-content" className={styles.noUnderline}>
            <h5 className={styles.forumHeading}>
              新增多人模式，挑戰你的策略極限
            </h5>
            <p className={styles.forumFigcaption}>
              新增多人模式，帶來前所未有的挑戰與樂趣。與朋友組隊或與全球玩家對戰，考驗你的策略和合作能力。準備好迎接新的冒險，挑戰你的極限！
            </p>
          </Link>
        </div>
      </div>
      {/* 2nd */}
      <div className={`row mt-5 mb-3`}>
        {/* pic */}
        <div className={`col-12 col-md-3 d-flex justify-content-center`}>
          <Image
            className={`w-100`}
            width={190}
            height={130}
            src="/forum/person-9.jpg"
            alt="..." />
        </div>
        {/* article */}
        <div className={`col-12 col-md-9`}>
          <Link href="/forum/news-content" className={styles.noUnderline}>
            <h5 className={styles.forumHeading}>跨平臺版本即將上線</h5>
            <p className={styles.forumFigcaption}>
              跨平臺版本即將上線，玩家將能在不同設備上無縫遊玩，享受更便捷的遊戲體驗。無論是在家用電腦、手機還是平板，隨時隨地展開冒險，感受遊戲的魅力！
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
