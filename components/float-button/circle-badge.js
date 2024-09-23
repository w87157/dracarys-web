import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";
import { CameraIcon } from "./CameraIcon";
import { Button } from "@nextui-org/react";

const LiveCircleBadge = () => {

  return (
    <>
      {/* 右下角固定 Badge */}
      <div className={`${styles.shopBadgeContainer} forPC-flex`}>
        <Link className={styles.btn} href="/live">
          <span className={styles.btnInner}>
            <CameraIcon />
          </span>
        </Link>
      </div>


    </>
  );
}
// export default function App() {
//   return <CameraIcon />;
// }
export default LiveCircleBadge
