import Link from "next/link";
import Image from "next/image";
import { heartIconFill, shoppingCartIcon, diamondIcon } from "@/asset/icon";
import styles from "./style.module.css";
import { useCart } from "@/hooks/use-cart";
import { FaClipboardList } from "react-icons/fa6"

const CircleBadge = () => {
  const { items } = useCart();
  return (
    <>
      {/* 右下角固定 Badge */}
      <div className={`${styles.shopBadgeContainer} forPC-flex`}>
        <Link className={styles.btn} href="/shop/shopping-cart">
          <span className={styles.btnInner}>
            <Image src={shoppingCartIcon} alt="" style={{ width: "auto" }} />

            {items.length !== 0 ? (
              <div className={`${styles["heartbeat"]} ${styles.carBadge}`}>
                {items.length}
              </div>
            ) : null}
          </span>
        </Link>
        <Link className={styles.btn} href="/shop/record#purchaseHistory">
          <span className={styles.btnInner}>
            <FaClipboardList style={{ height: "27" }} />
          </span>
        </Link>
        <Link className={`forPC-flex ${styles.btn}`} href="/shop/record#wishList">
          <span className={styles.btnInner}>
          <Image src={heartIconFill} alt="" style={{ width: "auto" }} />
          </span>
        </Link>
        <Link className={`forPC-flex ${styles.btn}`} href="/shop/record#rechargeHistory">
          <span className={styles.btnInner}>
          <Image src={diamondIcon} alt="" style={{ width: "auto" }} />
          </span>
        </Link>
      </div>
    </>
  );
}

export default CircleBadge
