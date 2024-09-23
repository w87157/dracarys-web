import { useState, useRef, useEffect } from "react";
import styles from "./shop-wrap.module.css";
import "aos/dist/aos.css"; // Animate On Scroll
import AOS from "aos"; // Animate On Scroll
interface ShopAreaProps {
  // displayed: JSX.Element;
  height?: string;
}

const ShopArea: React.FC<ShopAreaProps> = ({ height }: ShopAreaProps) => {
  const displayedWrapper = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>("0px");
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const updateProgress = () => {
    if (container.current) {
      const { scrollTop } = document.documentElement;
      const containerTop = container.current.offsetTop;
      const containerHeightNumber = container.current.offsetHeight;
      const innerHeight = window.innerHeight;

      const newProgress =
        ((scrollTop - containerTop) * 100) /
        (containerHeightNumber - innerHeight);

      setProgress(newProgress);
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      container.current &&
      displayedWrapper.current
    ) {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;

      if (!height) {
        setContainerHeight(
          `${
            (innerHeight * displayedWrapper.current.offsetWidth) / innerWidth
          }px`
        );
      } else {
        setContainerHeight(height);
      }

      setWrapperWidth(displayedWrapper.current.offsetWidth);
    }
  }, [height]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 150,
      once: false,
    });

    // 動態內容加載或更新後手動刷新 AOS
    AOS.refreshHard();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateProgress();
      window.addEventListener("scroll", updateProgress);
      return () => {
        window.removeEventListener("scroll", updateProgress);
      };
    }
  }, []);

  return (
    <div className={styles.myTest}>
      {/* <div className={styles.parallax01}></div> */}
      <div
        style={{
          height: containerHeight,
          overflow: "hidden",
          position: "relative",
        }}
        ref={container}
      >
        <div
          style={{
            display: "inline-block",
            height: "100vh",
            transform:
              progress >= 0
                ? progress > 100
                  ? `translateX(-${
                      (100 *
                        (wrapperWidth -
                          (typeof window !== "undefined"
                            ? window.innerWidth
                            : 0))) /
                      wrapperWidth
                    }%)`
                  : `translateX(-${
                      progress *
                      ((wrapperWidth -
                        (typeof window !== "undefined"
                          ? window.innerWidth
                          : 0)) /
                        wrapperWidth)
                    }%)`
                : "translateX(0%)",
            position:
              progress <= 100
                ? progress >= 0
                  ? "fixed"
                  : "static"
                : "absolute",
            bottom: 0,
            overflow: "hidden",
          }}
          ref={displayedWrapper}
        >
          {/* ShopAreaComponent */}
          <div style={{ display: "flex", width: "400vw" }}>
            <div
              className={`d-flex justify-content-center align-items-center text-light flex-column ${styles.myTestInner}`}
              style={{
                height: "100vh",
                flex: "0 0 25%",
              }}
            >
              <h1>盛夏傳奇，華麗登場！</h1>
              <h2>全新造型道具包，盡享中世紀風情！</h2>
              <p>
                今年夏天，給你的角色換上全新中世紀造型，加入我們的暑期強檔活動，體驗華麗新裝！
              </p>
              {/* <h1 data-aos="fade-down" data-aos-offset="10px">盛夏傳奇，華麗登場！</h1>
              <h2 data-aos="fade-up" data-aos-delay="200">全新造型道具包，盡享中世紀風情！</h2>
              <p data-aos="fade-in" data-aos-delay="400">今年夏天，給你的角色換上全新中世紀造型，加入我們的暑期強檔活動，體驗華麗新裝！</p> */}
            </div>

            <div
              className="d-flex justify-content-center align-items-center text-light flex-column"
              style={{
                height: "100vh",
                flex: "0 0 25%",
                // backgroundImage: 'url("./img/top_shop_bg_1.png")',
                // backgroundColor: 'var(--bs-primary)',
              }}
              id="#anchor02"
              data-delay="5s"
              data-aos="flip-left"
            >
              <h1>多種風格，任君挑選！</h1>
              <h2>從騎士到貴族，隨心所欲搭配！</h2>
              <p>
                無論你喜愛騎士風、貴族風還是法師風，我們的造型道具包都能滿足你的需求！
              </p>
            </div>

            <div
              className="d-flex justify-content-center align-items-center text-light flex-column"
              style={{
                height: "100vh",
                flex: "0 0 25%",
                // backgroundColor: 'var(--bs-dark)',
                // borderRight: '1px solid var(--bs-primary)',
              }}
            >
              <h1>即刻裝備，全面升級！</h1>
              <h2>讓你的遊戲體驗煥然一新！</h2>
              <p>
                全新造型不僅帶來視覺享受，更讓你在遊戲中獲得更多驚喜與獎勵！
              </p>
            </div>

            <div
              className="d-flex justify-content-center align-items-center text-light flex-column"
              style={{
                height: "100vh",
                flex: "0 0 25%",
                // backgroundColor: 'var(--bs-primary)',
                // borderRight: '1px solid var(--bs-primary)',
              }}
            >
              <h1>邀請好友，一同冒險！</h1>
              <h2>與朋友一起享受中世紀盛典！</h2>
              <p>
                立即購買造型道具包，邀請好友一同體驗，共同創造難忘的夏日回憶！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopArea;
