import React, { useEffect, useState } from "react";
import styles from "@/styles/Art.module.css";
import Image from "next/image";

export default function RankingCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/art-gallery/vote-list")
      .then((r) => r.json())
      .then((myData) => {
        // console.log(myData, 'weee')
        setData(myData);
      })
      .catch((ex) => console.log(ex));
  }, []);

  if (data.length === 0) return <></>;

  return (
    <>
      <div className={styles.content}>
        <h3 className="text-light text-center mb-0">ranking</h3>
        <p className="text-center text-primary fw-bold mb-0">人氣排行</p>
        {data?.slice(0, 8).map((v, i) => {
          let style = "c" + (i + 1);
          return (
            <a
              key={v.id}
              className={`${styles.card} ${styles[style]}`}
              href={`http://localhost:3000/art-gallery/vote/${v.id}`}
              target="_blank"
            >
              <Image className={styles.rankImg} src={v.img} alt="" width="350" height="200" />
              <p className={styles.rankP}>{v.title}</p>
            </a>
          );
        })}
      </div>
    </>
  );
}
