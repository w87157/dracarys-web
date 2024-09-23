import React, { useEffect } from "react";
import styles from "@/styles/Art.module.css";
import CounterCard from "@/components/art-gallery/Counter-card";
import RankingCard from "@/components/art-gallery/Ranking-card";
import CategoryCard from "@/components/art-gallery/Category-card";
import PackageCard from "@/components/art-gallery/Package-card";
import Link from "next/link";
import Image from "next/image";

export default function Artindex() {

  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);



  return (
    <>
      {/*////////////////////////// ranking ////////////////////////*/}
      <section
        className="container-fluid overflow-hidden"
        style={{ marginTop: "7vh" }}
      >
        <div
          className="container row p-0 overflow-hidden"
          style={{ height: "95vh", margin: "auto" }}
        >
          <div className="col-12 px-0">
            <article className="position-relative d-flex align-items-center justify-content-center ">
              <RankingCard />
            </article>
          </div>
        </div>
      </section>
      {/*///////////////////////// counter /////////////////////////////*/}
      <section
        className={`container-fluid overflow-hidden text-center ${styles.counterImage}`}
        style={{ height: "100vh" }}
      >
        <div className="container row h-100 mx-auto p-0">
          <div className="col-12 h-100 px-0 d-flex flex-column justify-content-around py-5">
            <article className="d-flex flex-column align-items-center">
              <div>
                <h3 className="text-light mb-0">voting ends in</h3>
                <Image
                  src="/art-gallery/line.png"
                  alt=""
                  // width="300"
                  // height="2"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
                <h4
                  className="text-primary fw-bold"
                  style={{ textShadow: "0 0 10px black" }}
                >
                  {/* 投票倒數計時 */}
                  倒數計時
                </h4>
              </div>
            </article>
            <article>
              <CounterCard />
            </article>
            <article className="d-flex flex-column align-items-center">
              <div className="d-flex flex-column align-items-center">
                <p style={{ textShadow: "0 0 8px black" }}>
                  快點幫你最喜歡的創作者加油
                </p>
                <button
                  className="btn btn-outline mt-3 text-primary"
                  style={{
                    backgroundColor: "transparent",
                    fontFamily: "Noto Sans TC, sans-serif",
                  }}
                >
                  <Link
                    href="/art-gallery/vote"
                    style={{
                      textDecoration: "none",
                      color: "rgb(187, 175, 116)",
                    }}
                  >
                    投票去
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </Link>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
      {/*/////////////////////////// vote /////////////////////////////*/}
      <section
        className={`container-fluid overflow-hidden ${styles.sectionBg}`}
        style={{ paddingTop: "10vh" }}
      >
        <div className=" row container h-100 mx-auto p-0">
          {/* 1. */}
          <div className="col-12 my-6 h-50 mb-md-5">
            <div className="row ">
              {/* 模糊背景 */}
              <div className="col-12 d-flex p-0 flex-column flex-md-row vote-sec pb-4" >
                <div className="pad col-12 col-md-6 d-flex flex-column align-items-end justify-content-center py-md-5" >
                  <h4 className="text-primary mb-4 text-end" >我要投票</h4>
                  {/* <p className="fw-bold my-3">投票規則</p> */}
                  <p
                    className="fw-light text-end ps-12 ps-md-5 lh-base"
                    style={{ textAlign: "justify" }}
                  >
                    2024年9月9日至2024年10月9日<span className="intro"> | 投票時間  </span> <br />
                    已註冊並登入的用戶 <span className="intro"> | 投票資格 </span><br />
                    可為自己喜愛的作品投一票，同一作品只能投一次 <span className="intro"> | 投票方式</span> <br />
                    系統將檢測並阻止重複或非法投票 <span className="intro"> | 投票限制</span> <br />
                    於2024年10月9日在本網站論壇區公佈 <span className="intro"> | 投票結果 </span> <br />
                    觀賞、按讚及人氣投票加權後綜合評比 <span className="intro"> | 評分標準 </span> <br />
                  </p>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center py-md-5 " >
                  <Link
                    href="/art-gallery/vote"
                    target=""
                    style={{ textDecoration: "none" }}
                  >
                    <div className={styles.vCard} >
                      <div className={styles.wrapper}>
                        <Image
                          src="/art-gallery/vote-back.jpg"
                          className={styles.coverImage}
                          alt=""
                          width="600"
                          height="600"
                        />
                      </div>
                      <button className={`btn btn-outline ${styles.vTitle} `}>
                        即刻投票
                        <div className="button__horizontal"></div>
                        <div className="button__vertical"></div>
                      </button>
                      <Image
                        src="/art-gallery/vote-pop.png"
                        className={styles.character}
                        alt=""
                        // width="600"
                        // height="400"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </Link>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
          {/* 2. */}
          <div className="col-12 mb-6 h-50 d-flex flex-column flex-row-md my-5 vote-sec">
            <div className="row ">
              <div className="col-12 d-flex p-0 flex-column flex-md-row" >
                <div className="col-12 col-md-6 d-flex flex-column align-items-start justify-content-center py-5 order-1 order-md-2">
                  <h4 className="text-primary mb-4">我要報名</h4>
                  <p
                    className="fw-light text-start ps-12 pe-md-5 lh-base"
                    style={{ textAlign: "justify", fontWeight: "100" }}
                  >
                    <span className="intro">參賽資格 | </span> 參賽者需為年滿18歲的個人<br />
                    <span className="intro">報名方式 |</span> 參賽者需在線上填寫報名表並繳交參賽作品<br />
                    <span className="intro">作品尺寸 |</span> 作品尺寸不得超過200MB<br />
                    <span className="intro">作品提交 |</span> 需在報名截止日期前上傳並附上作品名稱及創作理念<br />
                    <span className="intro"> 報名費用 |</span> 每位參賽者無需支付任何費用<br />
                    <span className="intro"> 截止日期 |</span> 所有報名及作品提交需於2024年9月9日前完成<br />
                  </p>
                </div>
                <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center py-5 order-2 order-md-1">
                  <Link
                    href="/art-gallery/register"
                    target=""
                    style={{ textDecoration: "none" }}
                  >
                    <div className={styles.vCard} >
                      <div className={styles.wrapper}>
                        <Image
                          src="/art-gallery/vote-back1.jpg"
                          className={styles.coverImage}
                          alt=""
                          // height="600"
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <button className={`btn btn-outline ${styles.vTitle} `}>
                        即刻報名
                        <div className="button__horizontal"></div>
                        <div className="button__vertical"></div>
                      </button>
                      <Image
                        src="/art-gallery/vote-pop1.webp"
                        className={styles.character}
                        alt=""
                        // height="400" 
                        // width="600"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  </Link>
                  {/*  */}
                </div>
              </div>
            </div>
          </div>
          {/* 2end */}
        </div>
      </section>
      {/*////////////////////////// category /////////////////////////////*/}
      <section
        className="container-fluid py-5 mt-3 overflow-hidden"
        style={{ position: "relative" }
        }
      >
        <Image
          className={styles.magicCircleL}
          src="/art-gallery/magicCircle.png"
          alt=""
          height="300"
          width="300"
          priority
        />
        <Image
          className={styles.magicCircleR}
          src="/art-gallery/magicCircle.png"
          alt=""
          height="300"
          width="300"
          priority
        />
        <div className="container row h-100 mx-auto p-0">
          <div
            className="col-12 px-0 h-100 d-flex flex-column "
            style={{
              gap: "20px",
            }}
          >
            <article className="text-center mb-2">
              <h3 className="text-light">category</h3>
              <Image
                src="/art-gallery/line.png"
                alt=""
                width="300"
                height="10"
                style={{ width: "300px" }}
              />
              <p className="text-primary fw-bold">作品分類</p>
            </article>
            <article className="d-flex flex-column flex-md-row justify-content-evenly h-100 p-2 mt-4">
              <CategoryCard />
            </article>
          </div>
        </div>
      </section>
      <style jsx>
        {`
        .intro {
          color: rgb(187, 175, 116);
        }


        .vote-sec {
          background: hsla(0, 0%, 0%, 0.2);
          -webkit-backdrop-filter: blur(1px);
          backdrop-filter: blur(1.9px);
          border-radius: 3px;
        }
        
        @media screen and (max-width: 500px) {
          .pad {
           padding-bottom: 100px;
          }
        }

      `}</style>
    </>
  );
}
