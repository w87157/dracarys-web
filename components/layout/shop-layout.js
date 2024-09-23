import Navbar from "./default-layout/my-navbar";
import Footer from "./default-layout/footer";
import styles from "@/styles/Shop.module.css";
import { CartProvider } from "@/hooks/use-cart";
import CircleBadge from "@/components/shop-circle-badge/circle-badge";

const ShopLayout = ({ children }) => {
  return (
    <>
      <div id={styles.productWrap} className="col-lg-8 d-flex flex-column">
          <Navbar />
          <main
            className={`flex-shrink-0 ${styles["min-height"]} ${styles["foot-pt"]}`}
          >
            {children}
          </main>
          <Footer />
          {/* 右下角固定 Badge */}
          <CircleBadge />
      </div>
    </>
  );
}

export default ShopLayout