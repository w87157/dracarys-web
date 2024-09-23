import React, { useState, useEffect } from 'react';
import { useSave } from "@/hooks/use-save";

export default function Saveicon({ artwork, showModal }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { saves, addSaves, removeSaves } = useSave()

  // handle toggle | 加入移除珍藏
  const handleToggle = (e) => {
    e.preventDefault();
    if (isFavorited) {
      removeSaves(artwork.id)
      showModal('已移除收藏');
      // console.log(artwork)
    } else {
      addSaves(artwork)
      showModal('已加入收藏');
      // console.log(artwork)
    }
  };

  useEffect(() => {
    const i = saves.find((item) => {
      return item.id === artwork.id
    });
    setIsFavorited(!!i)


  }, [artwork, saves])
  return (
    <>
      {isFavorited ? <i className="bi bi-bookmarks-fill " onClick={handleToggle}></i> : <i className="bi bi-bookmarks " onClick={handleToggle}></i>}
      <style jsx>{`
        i {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
