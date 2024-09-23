import React from "react"
import styles from "@/styles/Forum.module.css"
// import BreadCrumb from "@/components/forum/breadcrumb"
import ContentTop from "@/components/forum/Content-Top"
// import ForumComment from '@/components/forum/Forum-Comment'
import ForumMore from '@/components/forum/Forum-More'
import Image from "next/image";
import Link from "next/link";

export default function ForumContent() {
  return (
    <>
      <div className={`container-fluid flex-column ${styles.forumForumArea}`}>
        <div className={`container mb-5 ${styles.forumContainer}`}>
          <div className={`row d-flex mb-5 ${styles.forumRow}`}>

            {/* breadcrumb 有空再做*/}
            {/* <BreadCrumb /> */}

            {/* content */}
            <div className={`row ${styles.forumRow}`}>
              <div className={`col-12 d-flex gap-2 ${styles.forumEvent}`}>
                <div className={`row mt-5 mb-3`}>
                  <h2 className={styles.forumHeading}>新手村地圖全攻略</h2>
                  <hr style={{ color: '#bbaf74' }} />

                  <ContentTop />

                  <article className={`row col-12`}>
                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>新手村是《龍焰與魔法》中每位玩家踏入遊戲世界的起點。這裡的地圖雖小，但卻蘊含著豐富的資源和任務，幫助新手玩家快速熟悉遊戲的基本操作和機制。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>首先，建議玩家在進入新手村後，立即前往村莊中心的NPC處接取初始任務。這些任務通常包括簡單的打怪和採集，能夠幫助你快速升級並獲得一些基礎裝備。記得與村莊中的每一位NPC對話，因為他們可能會提供隱藏任務和有用的信息。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>其次，新手村的地圖中有許多重要地點，如鍛造坊、藥店和訓練場。在鍛造坊，你可以強化和修理裝備；藥店則出售各種恢復藥劑，幫助你在戰鬥中保持狀態；訓練場則是提高角色技能和熟練度的好地方。</p>
                  </article>
                  <figure>
                    <Image
                      className={`justify - content - center`}
                      src="/forum/world-1.jpg"
                      alt="..."
                      width={850}
                      height={550}

                    />
                    <figcaption className={styles.forumFigcaption}>通過完成任務、與NPC互動和探索地圖，你將快速掌握遊戲的基本操作，為後續的冒險打下堅實的基礎。祝你在《龍焰與魔法》的世界中有個美好的開始！</figcaption>
                  </figure>

                  {/* 留言評論先不做 */}
                  {/* comment */}
                  {/* <h3 className={`mt-4 ${styles.forumHeading}`}>Comment</h3>
                  <ForumComment /> */}

                  <h3 className={`mt-4 ${styles.forumHeading}`}>More | 相關文章</h3>
                  <hr style={{ color: '#bbaf74' }} />

                  <ForumMore />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}