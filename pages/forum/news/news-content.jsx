import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from "@/styles/Forum.module.css"
// import BreadCrumb from "@/components/forum/breadcrumb"
import ContentTop from "@/components/forum/Content-Top"
import ContentList from "@/components/forum/Content-List"
import Image from "next/image";
import Link from "next/link";

export default function NewsContent() {

  useEffect(() => {
    document.title = '論壇 | Dragonfire & Sorcery';
  }, []);

  return (
    <>
      <div className={`container-fluid flex-column ${styles.forumNews}`}>
        <div className={`container mb-5 ${styles.forumContainer}`}>
          <div className={`row d-flex ${styles.forumRow}`}>

            {/* breadcrumb 有空再做 */}
            {/* <BreadCrumb /> */}

            {/* content */}
            <div className={`row ${styles.forumRow}`}>
              <div className={`col-12 d-flex gap-2 ${styles.forumEvent}`}>
                <div className={`row mt-5 mb-3 justify-content-center`}>
                  <h2 className={styles.forumHeading}>全新世界地圖與角色揭曉</h2>
                  <hr style={{ color: '#bbaf74' }} />

                  <ContentTop />

                  <article className={`row col-12`}>
                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>期待已久的新作《龍焰與魔法》終於揭曉，為玩家帶來一個全新的魔幻世界。這次更新中，開發團隊投入大量心血設計了全新的世界地圖，將帶領玩家踏上一段前所未有的冒險旅程。新地圖不僅擁有多樣的地形和風景，還充滿了神秘的隱藏寶藏和未知的危險挑戰，讓探索變得更加刺激和富有挑戰性。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>除了全新的世界地圖，《龍焰與魔法》還推出了數個全新角色，每個角色都有獨特的背景故事和技能設計。這些新角色將為遊戲注入新的活力，玩家可以選擇並培養他們，利用各自的特殊技能來應對不同的戰鬥和任務挑戰。新角色的加入不僅擴展了遊戲的可玩性，也為玩家提供了更多策略組合的可能性。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>這次更新還包括了多項系統優化和改進，提升了整體遊戲體驗。無論是視覺效果、音效還是操作手感，都得到了顯著提升。開發團隊表示，他們將持續關注玩家的反饋，進一步完善和豐富遊戲內容，為玩家帶來更加精彩的遊戲體驗。</p>
                  </article>
                  <figure className={`mt-3 justify-content-center`}>
                    <Image
                      className={styles.contentImg}
                      src="/forum/castle-7.jpg"
                      alt="..."
                      width={850}
                      height={450}
                    />
                    {/* <Image
                      className={''}
                      src="/forum/castle-2.jpg"
                      alt="..."
                      width={430}
                      height={430}
                    /> */}
                    <figcaption className={`mt-3 ${styles.forumFigcaption}`}>《龍焰與魔法》的全新世界地圖與角色現已上線，快來探索這個充滿魔法與冒險的新世界，展開屬於你的英雄之旅！</figcaption>
                  </figure>

                  <h3 className={`mt-5 ${styles.forumHeading}`}>More | 延伸閱讀</h3>
                  <hr style={{ color: '#bbaf74' }} />

                  {/* list */}
                  <ContentList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}