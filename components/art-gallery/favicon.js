import React from "react";
import { useState, useEffect } from "react";

export default function Favicon({ artwork, likes, setLikes, showModal }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // 依作品是否在珍藏列中設定其isFavorited的狀態(依此改變愛心外觀)
  useEffect(() => {
    const likedArtworks =
      JSON.parse(localStorage.getItem("DNS_art_like")) || [];
    const found = likedArtworks.find((v) => v.id === artwork.id);
    if (found) {
      setIsFavorited(true);
    }
  }, [artwork.id]);

  // handle toggle | 加入移除最愛
  const handleToggle = (e) => {
    e.preventDefault();
    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);

    const foundIndex = likes.findIndex((v) => v.id === artwork.id);
    let nextArtwork;
    if (!(foundIndex > -1)) {
      const newArtwork = { ...artwork };
      nextArtwork = [newArtwork, ...likes];
      showModal("已加入最愛");
    } else {
      nextArtwork = likes.filter((v) => v.id !== artwork.id);
      showModal("已從最愛移除");
    }

    setLikes(nextArtwork);
    localStorage.setItem("DNS_art_like", JSON.stringify(nextArtwork));
  };
  return (
    <>
      {isFavorited ? (
        <i className="bi bi-heart-fill " onClick={handleToggle}></i>
      ) : (
        <i className="bi bi-heart " onClick={handleToggle}></i>
      )}
      <style jsx>{`
        i {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
