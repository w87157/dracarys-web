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
                <div className={`row mt-5 mb-3 justify-content-center`}>
                  <h2 className={styles.forumHeading}>終極BOSS擊敗攻略</h2>
                  <hr style={{ color: '#bbaf74' }} />

                  <ContentTop />

                  <article className={`row col-12`}>
                    <p className={`mt-3 mb-3 ${styles.forumArticle}`}>挑戰《龍焰與魔法》的終極BOSS需要策略與技巧。首先，你需要了解BOSS的技能和攻擊模式。終極BOSS通常會有多階段的變化，每個階段的攻擊方式和弱點都不同。建議玩家在戰鬥前仔細觀察BOSS的行動，找出其攻擊模式的規律。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>其次，選擇合適的裝備和隊伍配置是關鍵。推薦使用具有高防禦和生命值的坦克角色來承受BOSS的傷害，同時搭配擁有高輸出能力的攻擊角色和能夠提供治療的輔助角色。建議裝備具有減少傷害和提升輸出的附魔裝備，並使用能夠增加隊伍生存能力的技能。</p>
                    <p className={`mb-3 ${styles.forumArticle}`}>在戰鬥過程中，保持隊伍的靈活性和協作至關重要。坦克需要保持仇恨，避免BOSS攻擊其他隊員；攻擊角色要集中火力在BOSS的弱點上，快速減少其生命值；輔助角色則需隨時觀察隊伍狀況，提供及時的治療和支援。</p>
                  </article>
                  <figure>
                    <Image
                      className={``}
                      src="/forum/dragon-1.jpg"
                      alt="..."
                      width={850}
                      height={550}

                    />
                    <figcaption className={styles.forumFigcaption}>挑戰終極BOSS需要耐心和團隊合作。通過合理的戰術安排和持續的練習，相信你能夠成功擊敗BOSS，獲得豐厚的戰利品。</figcaption>
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