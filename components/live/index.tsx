import { fetchLiveList } from "@/api/live";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ILive } from "@/interfaces";
import styles from "@/styles/live/index.module.scss";

interface Props {
  name: string;
}

const Home: React.FC<Props> = () => {
  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [liveRoomList, setLiveRoomList] = useState<ILive[]>([]);
  const [currentLiveRoom, setCurrentLiveRoom] = useState<ILive>({});
  const [flvPlayer, setFlvPlayer] = useState<any>(null);

  function initFlvPlayer(url: string, videoElement: HTMLVideoElement | null) {
    if (typeof window !== "undefined" && videoElement) {
      const flvjs = require("flv.js");
      if (flvjs.isSupported()) {
        if (flvPlayer) {
          flvPlayer.unload();
          flvPlayer.detachMediaElement();
          flvPlayer.destroy();
        }
        const newFlvPlayer = flvjs.createPlayer({
          type: "flv",
          url: url,
        });
        newFlvPlayer.attachMediaElement(videoElement);
        newFlvPlayer.load();
        newFlvPlayer.play();
        setFlvPlayer(newFlvPlayer);
      }
    }
  }

  async function getLiveRoomList() {
    try {
      const res = await fetchLiveList({
        orderName: "created_at",
        orderBy: "desc",
      });
      if (res.code === 200) {
        setLiveRoomList(res.data.rows);
        if (res.data.count) {
          const firstRoom = res.data.rows[0];
          setCurrentLiveRoom(firstRoom);
          if (firstRoom.flvurl) {
            initFlvPlayer(firstRoom.flvurl, localVideoRef.current);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLiveRoomList();
  }, []);

  useEffect(() => {
    if (currentLiveRoom?.flvurl) {
      initFlvPlayer(currentLiveRoom.flvurl, localVideoRef.current);
    }
  }, [currentLiveRoom]);

  function joinRoom() {
    router.push({
      pathname: "live/webrtc-pull",
      query: { roomId: currentLiveRoom.roomId },
    });
  }

  return (
    <>
      <div className={styles["home-wrap"]}>
        <Left
          currentLiveRoom={currentLiveRoom}
          liveRoomList={liveRoomList}
          joinRoom={joinRoom}
          muted={true}
          localVideoRef={localVideoRef}
        />
        <Right
          currentLiveRoom={currentLiveRoom}
          liveRoomList={liveRoomList}
          setCurrentRoom={setCurrentLiveRoom}
        />
      </div>
    </>
  );
};

function Left({
  currentLiveRoom,
  liveRoomList,
  joinRoom,
  muted,
  localVideoRef,
}: {
  currentLiveRoom: ILive;
  liveRoomList: ILive[];
  joinRoom: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  muted: boolean;
}) {
  return (
    <>
      <div
        className={`${styles.box} ${styles.left}`}
        style={{ backgroundImage: `url(${currentLiveRoom?.coverImg})` }}
      >
        <div className={styles["video-container"]}>
          {liveRoomList.length ? (
            // <div className={styles.btn} onClick={joinRoom}>
            //   進入直播
            // </div>
            <Link
              href=""
              className="col-3 mt-5 mb-5 btn btn-primary"
              onClick={joinRoom}
              role="button"
            >
              進入直播！
              <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

function Right({
  liveRoomList,
  currentLiveRoom,
  setCurrentRoom,
}: {
  liveRoomList: ILive[];
  currentLiveRoom: ILive;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ILive>>;
}) {
  const sortedLiveRoomList = [...liveRoomList].reverse();
  return (
    <div className={`${styles.box} ${styles.right}`}>
      <Link
        href="./live/webrtc-push"
        className="col-3 btn btn-primary mt-2"
        role="button"
      >
        馬上直播！
        <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>
      <div className={styles["list-wrap"]}>
        {sortedLiveRoomList.length ? (
          <div className={styles.list}>
            {sortedLiveRoomList.map((item: ILive, index: number) => (
              <div
                key={index}
                className={`${styles.item} ${
                  item.roomId === currentLiveRoom.roomId ? "active" : ""
                }`}
                style={{ backgroundImage: `url(${item.coverImg})` }}
                onClick={() => setCurrentRoom(item)}
              >
                <div
                  className={styles.border}
                  style={{
                    opacity: item.roomId === currentLiveRoom.roomId ? 1 : 0,
                  }}
                ></div>
                {item.roomId === currentLiveRoom.roomId && (
                  <div className={styles.triangle}></div>
                )}
                <div className={styles.txt}>房間 : {item.socketId}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.none}>目前沒有線上的直播房間</div>
        )}
      </div>
    </div>
  );
}

export default Home;
