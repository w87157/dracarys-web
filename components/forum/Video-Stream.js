import React from "react";
import styles from "@/styles/Forum.module.css";

export default function ForumLiveStream() {

  return (
    <>
      {/* video player */}
      <div
        className={`container-fluid flex-column mb-5 ${styles.forumContainer}`}
      >

        <div className={`container ${styles.forumRow}`}>
          <div className={`row d-flex flex-column flex-lg-row ${styles.forumVideo}`}>
            <div>
              <h2 className={`text-center ${styles.forumHeading}`}>相關影片</h2>
            </div>

            <div className="col-12 col-lg-6 mb-3">
              <div className="ratio ratio-16x9">
                <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/oUTIvZSExYU?si=3qu3lEaeat02lYgF"
                  title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                >
                </iframe>
              </div>
            </div>

            <div className="col-12 col-lg-6 mb-3">
              <div className="ratio ratio-16x9">
                <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/HIskupQR8E0?si=CQIdQtVHQVDSlUiY"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                >
                </iframe>
              </div>
            </div>

            <div className="col-12 col-lg-6 mb-3">
              <div className="ratio ratio-16x9">
                <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/92pOvsIRn5U?si=OAM2vNd6dBZO1jXu"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                >
                </iframe>
              </div>
            </div>

            <div className="col-12 col-lg-6 mb-3">
              <div className="ratio ratio-16x9">
                <iframe width="560" height="315"
                  src="https://www.youtube.com/embed/Nv1ePIL9svc?si=CPRfvZUQJ8V5P27u"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                >
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
