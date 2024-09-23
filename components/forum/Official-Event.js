import { useEffect, useState } from "react";
import styles from "@/styles/Forum.module.css";
import { useRouter } from "next/router";
import ForumCard from "@/components/forum/Forum-Card";
import Link from "next/link";


export default function ForumEvents() {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/forum/forums") // 確保該路徑正確
      .then((response) => response.json())
      .then((data) => {
        setData(data.events);
        console.log(data.events);
      })
      .catch((error) => console.error("本期活動已經結束", error));
  }, []);

  // const handleReadAll = (data) => {
  //     router.get(`/forum/ForumTop/${data}`);
  // };

  return (
    <>
      {/* official event */}
      <div className={`row d-flex align-items-center  ${styles.forumRow}`}>
        <div
          className={`col-12 col-md-9 mb-1 d-flex flex-column align-items-center`}
        >
          <div className={`row justify-content-center ${styles.forumRow}`}>
            <h2 className={styles.forumHeading}> Official Event 官方活動</h2>
            <div className={`col-12 d-flex ${styles.forumEvent}`}>
              <div className={`row mt-3 mb-3`}>
                {/* pic */}
                <ForumCard />

                {/* article */}
                <div className={`col-12 col-sm-6`}>
                  {data.map((event, index) => (
                    <div key={index}>
                      <h5 className={styles.forumHeading}>
                        {event.article_title}
                      </h5>
                      <hr style={{ color: "#bbaf74" }} />
                      <p>{event.description}</p>

                      <button
                        type="button"
                        className="col-3 mt-3 mb-5 btn btn-secondary"
                        onClick={() => router.push(`/forum/news/top-official-event-${event.id}`)}
                      >
                        Read All
                        <div className="button__horizontal"></div>
                        <div className="button__vertical"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
