import { useEffect } from "react";
import styles from "./shop-wrap.module.css";
import "aos/dist/aos.css"; // Animate On Scroll
import AOS from "aos"; // Animate On Scroll
import Link from "next/link";
import Image from "next/image";

const ProductArea = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: false,
      easing: "ease-in-sine",
      mirror: true,
    });

    // 動態內容加載或更新後手動刷新 AOS
    AOS.refresh();
  }, []);

  return (
    <section id={styles.shopWrap}>
      <div className={styles.parallaxContent}>

        <div className="text-center text-primary mt-5"
          data-aos="zoom-in-up"
        >
          <h2 className={styles.h2Title}>online shop</h2>
          <div>
          <Image alt="" width={300} height={10} src="/art-gallery/line.png" />
          </div>
          <h4 class="text-white mt-2">虛寶商城</h4>
        </div>

        <div className={styles.parallaxContentInner}
          data-aos="zoom-in-up"
        data-aos-delay="4s"
        >
          <div className={styles.productImg}>
            <figure className="position-absolute">
              <Image src="/top-page/game_character_1.png" width="360" height="360" alt="" />
            </figure>
            <div className={styles.productImgFrame}></div>
          </div>
          <div
            className={styles.productDesc}
          >
            <h3 className={styles.h3_p_title}>王者戰裝</h3>
            <p className="fs-regular">
              踏入戰場，唯有王者才能引領勝利！好戰的戰士，穿上這套王者戰裝，展示你無與倫比的領導風範。這套裝備以鋼鐵與金色裝飾為主，象徵著無可匹敵的力量與榮耀。無論面對何種挑戰，你將帶領你的團隊取得最輝煌的勝利！
            </p>
          </div>
        </div>

        <div className={styles.parallaxContentInner}
          data-aos="zoom-in-up"
        data-aos-delay="4s"
        >
          <div className={styles.productImg}>
            <figure className="position-absolute">
              <Image src="/top-page/game_character_2.png" width="360" height="360" alt="" />
            </figure>
            <div className={styles.productImgFrame}></div>
          </div>
          <div
            className={styles.productDesc}
          >
            <h3 className={styles.h3_p_title}>智者探險服</h3>
            <p className="fs-regular"
            >
              知識是力量，探險是你的熱情。穿上這套智者探險服，化身為聰慧的探險家，探索未知的世界。這套裝備融合了實用與風格，輕便而堅韌，適合任何地形和環境。無論是尋找古老的遺跡還是破解神秘的謎題，這套裝備將成為你最可靠的夥伴。
            </p>
          </div>
        </div>

        <div className={styles.parallaxContentInner}
          data-aos="zoom-in-up"
          data-aos-delay="4s"
        >
          <div className={styles.productImg}>
            <figure className="position-absolute">
              <Image src="/top-page/game_character_3.png" width="360" height="360" alt="" />
            </figure>
            <div className={styles.productImgFrame}></div>
          </div>
          <div
            className={styles.productDesc}
          >
            <h3 className={styles.h3_p_title}>魅惑戰甲</h3>
            <p className="fs-regular"
            >
              外表可愛，內心卻如烈火般堅強。穿上這套魅惑戰甲，展現你的雙面魅力。這套裝備設計獨特，兼具可愛與艷麗，卻不失戰鬥的功能性。當你揮舞武器，敵人將會驚訝於你的戰鬥力。無論何時何地，你都是戰場上最耀眼的存在！
            </p>
          </div>
        </div>

        <div className={styles.parallaxContentInner}
          data-aos="zoom-in-up"
          data-aos-delay="4s"
        >
          <div className={styles.productImg}>
            <figure className="position-absolute">
              <Image src="/top-page/game_character_4.png" width="360" height="360" alt="" />
            </figure>
            <div className={styles.productImgFrame}></div>
          </div>
          <div
            className={styles.productDesc}
          >
            <h3 className={styles.h3_p_title}>冒險新手裝</h3>
            <p className="fs-regular"
            >
              無畏無懼，敢於嘗試。你是團隊中最年輕的成員，但你的熱情和勇氣讓人刮目相看。這套裝備輕盈靈活，專為新手設計，讓你能自由探索並迅速適應。無論你遇到什麼，你總是第一個衝上前去，成為大家的榜樣！
            </p>
          </div>
        </div>

        <Link
          role="button"
          className="mt-5 p-2 col-10 col-md-3 btn btn-outline fs-x-large fw-bold"
          href="/shop"
        >
          去商店逛逛
          <div className="button__horizontal"></div><div className="button__vertical"></div>
        </Link>
      </div>
    </section>
  );
}

export default ProductArea
