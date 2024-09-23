import React from "react";
import styles from "@/styles/Forum.module.css";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export default function NewsList() {
  return (
    <>
      {/* news */}
      <div className={`row d-flex ${styles.forumRow}`}>
        <div className={`col-12 col-md-9 mb-1 d-flex flex-column`}>
          <div className={`row`}>
            <h2 className={styles.forumHeading}>News 新聞</h2>
            <div className={styles.forumEvent}>
              {/* headline */}
              <div className={`col-12 d-flex justify-content-center `}>
                <div className={`row justify-content-center mt-5 mb-3`}>
                  <h3 className={styles.forumHeading}>
                    Headline News | 頭條新聞
                  </h3>
                  <hr style={{ color: "#bbaf74" }} />

                  {/* pic */}
                  <div className={`col-12 col-sm-6 `}>
                    <img
                      className="w-100 mb-2"
                      // width={500}
                      // height={500}
                      // fill
                      src="/forum/castle-7.jpg" alt="..."
                      style={{ objectFit: "cover" }}
                    />

                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <li
                      className={styles.ulList}
                      style={{ color: "#ffffff", marginBottom: "20px" }}
                    >
                      {/* <Link 
                                            className={styles.liList} 
                                            href="/forum/news/news-content">全新世界地圖與角色揭曉

                                            </Link> */}
                      <Link
                        className={`icon-link icon-link-hover ${styles.noUnderline}`}
                        href="/forum/news/news-content"
                      >
                        全新世界地圖與角色揭曉
                        <svg className="bi" aria-hidden="true">
                          <MdOutlineKeyboardDoubleArrowRight />
                        </svg>
                      </Link>
                    </li>
                    <li
                      className={styles.ulList}
                      style={{ color: "#ffffff", marginBottom: "20px" }}
                    >
                      <Link
                        className={`icon-link icon-link-hover ${styles.noUnderline}`}
                        href="/forum/news/news-content"
                      >
                        新增多人模式，挑戰你的策略極限
                        <svg className="bi" aria-hidden="true">
                          <MdOutlineKeyboardDoubleArrowRight />
                        </svg>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>

              {/* popular */}
              <div className={`col-12 d-flex justify-content-center `}>
                <div className={`row justify-content-center mt-5 mb-3`}>
                  <h3 className={styles.forumHeading}>
                    Popular News | 熱門新聞
                  </h3>
                  <hr style={{ color: "#bbaf74" }} />
                  {/* pic */}
                  <div className={`col-12 col-sm-6`}>
                    <img
                      className="w-100 mb-2"
                      // width={500}
                      // height={330}
                      src="/forum/person-2.jpg"
                      alt="..."
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {/* article */}
                  <div className={`col-12 col-sm-6`}>
                    <li
                      className={styles.ulList}
                      style={{ color: "#ffffff", marginBottom: "20px" }}
                    >
                      <Link
                        className={`icon-link icon-link-hover ${styles.noUnderline}`}
                        href="/forum/news/news-content"
                      >
                        引入動態天氣系統，提升遊戲體驗
                        <svg className="bi" aria-hidden="true">
                          <MdOutlineKeyboardDoubleArrowRight />
                        </svg>
                      </Link>
                    </li>
                    <li
                      className={styles.ulList}
                      style={{ color: "#ffffff", marginBottom: "20px" }}
                    >
                      <Link
                        className={`icon-link icon-link-hover ${styles.noUnderline}`}
                        href="/forum/news/news-content"
                      >
                        跨平臺版本即將上線
                        <svg className="bi" aria-hidden="true">
                          <MdOutlineKeyboardDoubleArrowRight />
                        </svg>
                      </Link>
                    </li>
                    <li className={styles.ulList} style={{ color: "#ffffff" }}>
                      <Link
                        className={`icon-link icon-link-hover ${styles.noUnderline}`}
                        href="/forum/news/news-content"
                      >
                        發布大型擴展包，增加新劇情與任務
                        <svg className="bi" aria-hidden="true">
                          <MdOutlineKeyboardDoubleArrowRight />
                        </svg>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pics area */}
          {/* 之後有空再做 */}
          {/* <div className={`row d-flex mt-5`}>
                            <div className={`row d-flex mb-3 ${styles.forumImg}`}>
                                <div className={`col-6 col-md-4`}><img src="dragon-1.jpg" alt="..." width={680} height={350} /></div>
                                <div className={`col-6 col-md-4 offset-md-4`}><img src="dragon-4.jpg" alt="..." width={350} height={350} /></div>
                            </div>
                            <div className={`row d-flex mb-3 ${styles.forumImg}`}>
                                <div className={`col-4 col-md-4`}><img src="dragon-2.jpg" alt="..." width={350} height={250} /></div>
                                <div className={`col-4 col-md-4`}><img src="dragon-3.jpg" alt="..." width={350} height={250} /></div>
                                <div className={`col-4 col-md-4`}><img src="dragon-5.jpg" alt="..." width={350} height={250} /></div>
                            </div>
                        </div> */}
        </div>
      </div>
    </>
  );
}
