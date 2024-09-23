import React from "react";
import { useEffect } from "react";
import styles from "@/styles/Forum.module.css";
import VideoStream from "@/components/forum/Video-Stream"

export default function LiveStream() {
  useEffect(() => {
    document.title = '論壇 | Dragonfire & Sorcery';
  }, []);

  return (
    <>
      <div className={`container-fluid flex-column ${styles.forumLiveStream}`}>

        <VideoStream />

      </div>
    </>
  )
}
