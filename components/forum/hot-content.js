import React from "react";
import styles from "@/styles/Forum.module.css";
import Link from "next/link";

export default function ForumTab() {
  return (
    <>
      {/* forum tab */}
      <div className={`row d-flex mt-5 mb-5 ${styles.forumRow}`}>
        <div className={`col-12 col-md-9 mb-1 d-flex flex-column`}>
          <div className={`row`}>
            {/* tabs */}
            <div className={`forum-tabs`}>
              <ul id="myTab" role="tablist" className={`nav nav-tabs`}>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link active`}
                    id="Guide-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Guide"
                    type="button"
                    role="tab"
                    aria-controls="Guide"
                    aria-selected="true"
                  >
                    Guide
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Equipment-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Equipment"
                    type="button"
                    role="tab"
                    aria-controls="Equipment"
                    aria-selected="false"
                  >
                    Equipment
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Map-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Map"
                    type="button"
                    role="tab"
                    aria-controls="Map"
                    aria-selected="false"
                  >
                    Map
                  </button>
                </li>
                <li className={`nav-item`} role="presentation">
                  <button
                    className={`nav-link`}
                    id="Other-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#Other"
                    type="button"
                    role="tab"
                    aria-controls="Other"
                    aria-selected="false"
                  >
                    Other
                  </button>
                </li>
              </ul>
            </div>

            {/* tab contents */}
            <div
              className={`col-12 flex-column tab-content ${styles.forumEvent}`}
            >
              {/* Guide Page */}
              <div
                className={`row tab-pane show active`}
                id="Guide"
                role="tabpanel"
                aria-labelledby="Guide-tab"
              >
                {/* 1st */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/dragon-1.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>終極BOSS擊敗攻略</h5>
                    <p>
                      挑戰《龍焰與魔法》的終極BOSS需要策略與技巧。本文詳細介紹終極BOSS的技能與弱點，並提供最佳裝備與隊伍配置建議，助你輕鬆過關。
                    </p>
                    <Link
                      role="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      href="/forum/forumarea/forum-content-1"
                    >
                      Read All
                    </Link>
                  </div>
                </div>
                {/* 2nd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/dragon-2.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>
                      快速提升等級的最佳路徑
                    </h5>
                    <p>
                      等級提升是玩家變強的基礎。本攻略將分享各階段快速升級的技巧，包括任務選擇、怪物刷新點及經驗加成的利用，讓你快速達到滿級。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 3rd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/dragon-3.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>高效刷副本技巧分享</h5>
                    <p>
                      副本是獲取裝備與資源的主要途徑。本文將介紹高效刷副本的技巧，從隊伍配置、技能使用到路線選擇，讓你事半功倍，輕鬆獲得豐厚獎勵。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 4th */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/dragon-5.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>競技場必勝策略</h5>
                    <p>
                      競技場是玩家展示實力的地方。這篇攻略將分析競技場中的常見對手與戰術，並提供應對不同職業的策略，幫助你在競技場中立於不敗之地。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
              </div>
              {/* Equipment Page */}
              <div
                className={`row tab-pane fade`}
                id="Equipment"
                role="tabpanel"
                aria-labelledby="Equipment-tab"
              >
                {/* 1st */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img className={`w-100`} src="/forum/b00k.jpg" alt="..." />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>新手裝備推薦指南</h5>
                    <p>
                      探索《龍焰與魔法》中最適合新手玩家的裝備選擇。從基礎武器到防具，這篇指南將幫助你快速提升戰力，輕鬆應對早期挑戰。
                    </p>
                    <Link href="/forum/forumarea/forum-content">
                      <button
                        type="button"
                        className="col-3 mt-5 mb-5 btn btn-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#addToCartModal"
                        onClick={() => {}}
                      >
                        Read All
                      </button>
                    </Link>
                  </div>
                </div>
                {/* 2nd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/person-1.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>終極裝備獲取攻略</h5>
                    <p>
                      終極裝備是每個玩家夢寐以求的寶藏。本攻略詳述如何通過任務、副本和活動獲得最強裝備，讓你在《龍焰與魔法》中無往不利。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 3rd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/person-2.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>裝備升級技巧分享</h5>
                    <p>
                      裝備升級是提升角色實力的關鍵。本文將介紹如何通過收集素材、參與活動和使用特定技巧來高效升級裝備，提升戰力。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 4th */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/person-3.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>
                      稀有裝備的獲取與搭配
                    </h5>
                    <p>
                      稀有裝備不僅能提升角色屬性，還能改變戰鬥策略。本文將深入分析稀有裝備的獲取途徑及最佳搭配，助你打造無敵戰士。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                      onClick={() => {}}
                    >
                      Read All
                    </button>
                  </div>
                </div>
              </div>
              {/* Map Page */}
              <div
                className={`row tab-pane fade`}
                id="Map"
                role="tabpanel"
                aria-labelledby="Map-tab"
              >
                {/* 1st */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-1.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>新手村地圖全攻略</h5>
                    <p>
                      探索《龍焰與魔法》中的新手村，了解各個重要地點及NPC位置。本攻略將幫助新手玩家快速熟悉環境，順利開始冒險之旅。
                    </p>
                    <Link
                      role="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      href="/forum/forumarea/forum-content-2"
                    >
                      Read All
                    </Link>
                  </div>
                </div>
                {/* 2nd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-2.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>隱藏寶藏地圖指南</h5>
                    <p>
                      發掘《龍焰與魔法》世界中的隱藏寶藏！本文詳述各地圖中的秘密地點及寶藏位置，帶你走上富有冒險的致富之路。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 3rd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-3.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>高級地區地圖解析</h5>
                    <p>
                      高級地區充滿挑戰與機遇。本攻略將介紹這些地區的地形特點、怪物分佈及資源點，助你高效探索，快速提升實力。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 4th */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-5.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>副本地圖詳解</h5>
                    <p>
                      了解《龍焰與魔法》各大副本的詳細地圖與路線。本文將提供各副本中的關鍵點、BOSS位置及最佳通關路徑，讓你的副本之旅更順暢。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
              </div>
              {/* Other Page */}
              <div
                className={`row tab-pane fade`}
                id="Other"
                role="tabpanel"
                aria-labelledby="Other-tab"
              >
                {/* 1st */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-7.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>
                      遊戲音樂製作幕後揭秘
                    </h5>
                    <p>
                      深入了解《龍焰與魔法》遊戲音樂的製作過程，從靈感來源到錄製過程，揭秘那些令人沉浸其中的音樂背後的故事與製作團隊的努力。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 2nd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/world-8.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>
                      玩家訪談：從零開始的遊戲人生
                    </h5>
                    <p>
                      專訪熱愛《龍焰與魔法》的忠實玩家，分享他們在遊戲中的故事、成就及心得，讓你感受遊戲社區的溫暖與激情。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 3rd */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/castle-5.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>遊戲周邊產品介紹</h5>
                    <p>
                      介紹《龍焰與魔法》官方推出的各類周邊產品，包括手辦、服裝、文具等，讓你在現實生活中也能體驗到遊戲的魅力。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
                {/* 4th */}
                <div className={`row mt-5 mb-3`}>
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className={`w-100`}
                      src="/forum/castle-6.jpg"
                      alt="..."
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <h5 className={styles.forumHeading}>
                      開發者日誌：未來更新計劃
                    </h5>
                    <p>
                      開發團隊分享《龍焰與魔法》未來的更新計劃，揭示即將到來的新內容、新功能及遊戲改進，讓玩家提前了解未來的遊戲方向。
                    </p>
                    <button
                      type="button"
                      className="col-3 mt-5 mb-5 btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#addToCartModal"
                    >
                      Read All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
