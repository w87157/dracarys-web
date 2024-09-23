import React from "react";
import styles from "@/styles/Forum.module.css";
import Image from "next/image";

export default function ForumMore() {
  return (
    <>
      {/* 1st */}
      <div className={`row mb-3 mt-3`}>
        {/* pic */}
        <div className={`col-12 col-md-3 d-flex justify-content-center`}>
          <Image className={`w-100 h-100`} src="/forum/dragon-2.jpg" alt="..." />
        </div>
        {/* article */}
        <div className={`col-12 col-md-9`}>
          <h5 className={styles.forumHeading}>快速提升等級的最佳路徑</h5>
          <p>
            等級提升是玩家變強的基礎。本攻略將分享各階段快速升級的技巧，包括任務選擇、怪物刷新點及經驗加成的利用，讓你快速達到滿級。
          </p>
        </div>
      </div>
      {/* 2nd */}
      <div className={`row mb-3 mt-3`}>
        {/* pic */}
        <div className={`col-12 col-md-3 d-flex justify-content-center`}>
          <Image className={`w-100 h-100`} src="/forum/dragon-3.jpg" alt="..." />
        </div>
        {/* article */}
        <div className={`col-12 col-md-9`}>
          <h5 className={styles.forumHeading}>高效刷副本技巧分享</h5>
          <p>
            副本是獲取裝備與資源的主要途徑。本文將介紹高效刷副本的技巧，從隊伍配置、技能使用到路線選擇，讓你事半功倍，輕鬆獲得豐厚獎勵。
          </p>
        </div>
      </div>
    </>
  );
}
