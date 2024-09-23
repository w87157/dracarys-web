import { createContext, useContext, useEffect, useState } from "react";

///// 建立與導出context
const SaveContext = createContext(null);

///// 建立provider + 輸出data
export function SaveProvider({ children }) {
  const storageKey = 'DNS_art_save';
  // array for save
  const [saves, setSaves] = useState([]);

  // add save
  const addSaves = (artwork) => {
    const foundIndex = saves.findIndex((v) => v.id === artwork.id);
    if (foundIndex > -1) {
      // 若有找到，代表已珍藏過
      alert("此作品已在你的最愛中");
      console.log(saves);
    } else {
      // 複製物件
      const favArtwork = { ...artwork };
      // 讓原始陣列添加新產品並讓它出現在最上面 [！]是「陣列」 -- []not{}
      const nextArtwork = [favArtwork, ...saves];
      localStorage.setItem(storageKey, JSON.stringify(nextArtwork));
      // 設定回state
      setSaves(nextArtwork);
    }
  };

  // remove save
  const removeSaves = (id) => {
    const nextArtwork = saves.filter((v, i) => {
      return v.id !== id;
    });
    localStorage.setItem(storageKey, JSON.stringify(nextArtwork));
    setSaves(nextArtwork);
  };

  useEffect(() => {
    let newData = [];
    const str = localStorage.getItem(storageKey);
    try {
      if (str) {
        newData = JSON.parse(str)
      }
    } catch (ex) { console.log(ex) }

    setSaves(newData)
  }, [])

  return (
    <SaveContext.Provider
      value={{
        saves,
        setSaves,
        addSaves,
        removeSaves,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
}

///// 打包useContext(saveContext)
export const useSave = () => useContext(SaveContext);
