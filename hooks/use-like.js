import { createContext, useContext, useState } from "react";

///// 建立與導出context
const LikeContext = createContext(null);

///// 建立provider + 輸出data
export function LikeProvider({ children }) {
  // array for likes
  const [likes, setLikes] = useState([]);

  // add like
  const addLikes = (artwork) => {
    const foundIndex = likes.findIndex((v) => v.id === artwork.id);

    if (foundIndex > -1) {
      // 若有找到，代表已珍藏過
      alert("此作品已在你的最愛中");
      console.log(likes);
    } else {
      // 複製物件
      const likeArtwork = { ...artwork };
      // 讓原始陣列添加新產品並讓它出現在最上面 [！]是「陣列」 -- []not{}
      const nextArtwork = [likeArtwork, ...likes];
      // 設定回state
      setLikes(nextArtwork);
      console.log(likes);
    }
  };
  // remove like
  const removeLikes = (id) => {
    const nextArtwork = likes.filter((v, i) => {
      return v.id !== id;
    });
    setLikes(nextArtwork);
  };
  return (
    <LikeContext.Provider
      value={{
        likes,
        setLikes,
        addLikes,
        removeLikes,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

///// 打包
export const useLike = () => useContext(LikeContext);
