import React from "react";
import styles from "@/styles/Forum.module.css";
// import Image from "next/image";

export default function ForumCard() {
  const data = [
    {
      img: "/forum/castle-2.jpg",
      // title1: "藝術走廊歡迎你投稿",
      // title2: "中秋大禮包早鳥預購開始",
      // p1: "藝術走廊是一個展示玩家才華的特別場所。在這裡，你可以分享你在遊戲世界中的靈感與創意，並與其他玩家共同欣賞彼此的作品。我們深知每位冒險者都有自己獨特的故事和視角，而藝術走廊正是你展示這些故事和視角的絕佳平臺。",
      // p2: "中秋禮包內含多種限量好禮，包括絕版服飾、稀有道具、強力增益藥水以及特別的中秋限定坐騎。這些珍貴的物品不僅能提升你的遊戲體驗，還能讓你的角色在這個特別的季節中閃耀全場。此外，禮包中還附贈專屬的中秋主題裝飾，讓你可以把節日的美好氣氛帶到你的遊戲世界中。",
    },
  ];

  return (
    <>
      {data.map((v, i) => {
        return (
          <div className="col-12 col-sm-6" key={v.img} >

            <img
              className="w-95 mb-2"
              // width={350}
              // height={350}
              src={v.img}
              // fill
              alt="..." />



            <style jsx>{`
              .cCard {
                 {
                  /* height: 350px; */
                }
                z-index: 1;
              }

              .img {
                object-fit: cover;
                object-position: center;
                display: block;
                margin: auto;
                transition: all 0.5s;
              }

              .img:hover {
                transform: scale(1.5);
                box-shadow: 0 0 15px #bbaf74;
              }
            `}</style>
          </div>
        );
      })}
    </>
  );
}
