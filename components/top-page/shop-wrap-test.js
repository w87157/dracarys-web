import { useRef, useEffect, useState } from "react";
import styles from "./shop-wrap.module.css";

const ShopWrap = () => {
  const parallaxRef = useRef(null);
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <section>
        <div
          ref={parallaxRef}
          className={styles.parallax02}
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        ></div>
        <div className={styles.content02}>
          <h1>Scroll Down</h1>
          <p>This is some content</p>
        </div>
        <div
          ref={parallaxRef}
          className={styles.parallax02}
          style={{ transform: `translateY(${offsetY * 0.5}px)` }}
        ></div>
        <div className={styles.content02}>
          <h1>Scroll Down</h1>
          <p>This is some more content</p>
        </div>
      </section>
    </>
  );
}

export default ShopWrap
