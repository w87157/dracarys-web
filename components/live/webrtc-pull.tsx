import {
  DanmuMsgTypeEnum,
  IAdminIn,
  ICandidate,
  IOffer,
  TDamu,
  TLiveUser,
} from "@/interfaces";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from "@/network/webSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { webSocketService } from "@/lib/websocket-manager";
import { webRtcService } from "@/lib/webrtc-manager";
import { fetchLiveList } from "@/api/live";
import { ILive } from "@/interfaces";
import styles from "@/styles/live/webrtc-pull.module.scss";
import { useAuth } from '@/hooks/use-auth';


type Gift = { name: string; ico: string; price: string };

const noticeMap = {
  [DanmuMsgTypeEnum.danmu]: { title: "", subtitle: "" },
  [DanmuMsgTypeEnum.otherJoin]: { title: "系统通知：", subtitle: "玩家進入直播房間！" },
  [DanmuMsgTypeEnum.userLeaved]: {
    title: "系統通知：",
    subtitle: "玩家離開直播房間！",
  },
};

const PullPage: React.FC<{ roomId: string }> = (options) => {
  const { roomId } = options;
  const dispatch = useDispatch();
  // const liveStore =
  //   useSelector((state: RootState) => state.liveReducer) ;

  const [roomNoLive, setRoomNoLive] = useState(false);

  const [giftList, setGiftList]: [
    Gift[],
    React.Dispatch<React.SetStateAction<Gift[]>>
  ] = useState<Gift[]>([
    { name: "鮮花", ico: "", price: "免費" },
    { name: "可樂", ico: "", price: "2元" },
    { name: "雞腿", ico: "", price: "3元" },
    { name: "巧克力", ico: "", price: "5元" },
    { name: "鑽石", ico: "", price: "10元" },
  ]);

  const [liveUserList, setLiveUserList]: [
    TLiveUser[],
    React.Dispatch<React.SetStateAction<TLiveUser[]>>
  ] = useState<TLiveUser[]>([]);

  const [damuList, setDamuList]: [
    TDamu[],
    React.Dispatch<React.SetStateAction<TDamu[]>>
  ] = useState<TDamu[]>([]);

  const [localStream, setLocalStream]: [
    MediaStream | undefined,
    React.Dispatch<React.SetStateAction<MediaStream | undefined>>
  ] = useState<MediaStream | undefined>();

  const [danmuStr, setDanmuStr] = useState<string>("");
  const [isDone, setIsDone] = useState<Boolean>(false);
  // const [joined, setJoined] = useState<Boolean>(false);
  const joined = useRef<boolean>(false);
  const [isAddTrack, setIsAddTrack] = useState<Boolean>(false);

  const [offerSended, setOfferSended] = useState(new Set());
  const [currentLiveRoom, setCurrentLiveRoom] = useState<ILive>({});
  const [flvPlayer, setFlvPlayer] = useState<any>(null);

  const websocketInstance = useRef<WebSocketClass | undefined>();

  const topRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { auth } = useAuth();


  // getSocketId
  function getSocketId() {
    return websocketInstance.current!?.socketIo?.id || "-1";
  }

  // sendDanmu
  function sendDanmu(e:any) {
    e.preventDefault();
    if (!danmuStr.length) {
      alert("請輸入訊息內容！");
    }
    if (!websocketInstance.current) return;
    websocketInstance.current.send({
      msgType: WsMsgTypeEnum.message,
      data: { msg: danmuStr, login: auth.login? auth.login: '遊客' },
    });

    // 錯誤用法
    // console.log("setDamuList", [
    //   ...damuList,
    //   {
    //     socketId: getSocketId(),
    //     msgType: DanmuMsgTypeEnum.danmu,
    //     msg: danmuStr,
    //   },
    // ]);

    setDamuList((prevDamuList) => [
      ...prevDamuList,
      {
        socketId: getSocketId(),
        msgType: DanmuMsgTypeEnum.danmu,
        msg: danmuStr,
      },
    ]);
    // danmuStr = "";
    setDanmuStr("");
  }

  function closeRtc() {
    const rtcMap = webRtcService.getPool() || {};
    Object.keys(rtcMap).map((key) => {
      rtcMap[key].close();
    });
  }

  function initReceive() {
    console.log("initReceive", websocketInstance.current);
    const instance = webSocketService.getInstance(roomId);
    if (!instance?.socketIo) return;
    // websocket連接成功
    instance.socketIo.on(WsConnectStatusEnum.connect, () => {
      console.log("【websocket】websocket連接成功", instance.socketIo?.id);
      if (!instance) return;
      instance.status = WsConnectStatusEnum.connect;
      instance.update();
    });

    // websocket連接斷線
    instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      console.log("【websocket】websocket連接斷線", instance);
      if (!instance) return;
      instance.status = WsConnectStatusEnum.disconnect;
      instance.update();
    });

    // 目前所有線上用戶
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data: IAdminIn) => {
      console.log("【websocket】收到管理員正在直播", data);
    });

    // 目前所有線上用戶
    instance.socketIo.on(WsMsgTypeEnum.roomNoLive, (data: IAdminIn) => {
      console.log("【websocket】收到管理員不在直播", data);
      setRoomNoLive(true);
      closeRtc();
    });

    // 目前所有線上用戶
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      console.log("【websocket】目前所有線上用戶", data);
      if (!instance) return;
      // liveUserList = data.map((item) => ({
      //   avatar: "red",
      //   socketId: item.id,
      //   expr: 1,
      // }));
      setLiveUserList(
        data.map((item: any) => ({
          avatar: "red",
          socketId: item.id,
          expr: "巨龍-天使拉爾",
        }))
      );
    });

    // 收到offer
    instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
      console.warn("【websocket】收到offer", data);
      if (!instance) return;
      console.log("987654321", data.data.receiver, getSocketId());

      if (data.data.receiver === getSocketId()) {
        console.log("收到offer，這個offer是傳給我的");
        const rtc = startNewWebRtc(data.data.sender);
        await rtc.setRemoteDescription(data.data.sdp);
        const sdp = await rtc.createAnswer();
        await rtc.setLocalDescription(sdp);
        websocketInstance.current?.send({
          msgType: WsMsgTypeEnum.answer,
          data: { sdp, sender: getSocketId(), receiver: data.data.sender },
        });
      } else {
        console.log("收到offer，但是這個offer不是傳給我的");
      }
    });

    // 收到answer
    instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
      console.warn("【websocket】收到answer", data);
      if (isDone) return;
      if (!instance) return;
      const rtc = webRtcService.getInstance(`${roomId}___${data.socketId}`);
      console.log(rtc, "收到answer收到answer");
      if (!rtc) return;
      rtc.rtcStatus.answer = true;
      rtc.update();
      if (data.data.receiver === getSocketId()) {
        console.log("收到answer，這個answer是傳給我的");
        await rtc.setRemoteDescription(data.data.sdp);
      } else {
        console.log("收到answer，但這個answer不是傳給我的");
      }
    });

    // 收到candidate
    instance.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
      console.warn("【websocket】收到candidate", data);
      if (isDone) return;
      if (!instance) return;
      const rtc =
        webRtcService.getInstance(`${roomId}___${data.socketId}`) ||
        webRtcService.getInstance(roomId);
      if (!rtc) return;
      if (data.socketId !== getSocketId()) {
        console.log("不是我傳的candidate");
        const candidate = new RTCIceCandidate({
          sdpMid: data.data.sdpMid,
          sdpMLineIndex: data.data.sdpMLineIndex,
          candidate: data.data.candidate,
        });
        rtc.peerConnection
          ?.addIceCandidate(candidate)
          .then(() => {
            console.log("candidate成功");
          })
          .catch((err: any) => {
            console.error("candidate失敗", err);
          });
      } else {
        console.log("是我傳的candidate");
      }
    });

    // 收到用戶傳送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data) => {
      console.log("【websocket】收到用戶傳送消息", data);
      if (!instance) return;
      setDamuList((prevDamuList) => [
        ...prevDamuList,
        {
          socketId: data.socketId,
          msgType: DanmuMsgTypeEnum.danmu,
          msg: data.data.msg,
          login: data.data.login,
        },
      ]);
    });

    // 用戶加入房間完成
    instance.socketIo.on(WsMsgTypeEnum.joined, (data) => {
      console.log("【websocket】用戶加入房間完成", data);
      // joined = true;
      joined.current = true;
    });

    // 其他用戶加入房間
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
      console.log("【websocket】其他用戶加入房間", data);
      if (joined) {
        batchSendOffer();
      }
      // setDamuList((prevDamuList) => [
      //   ...prevDamuList,
      //   {
      //     socketId: data.socketId,
      //     msgType: DanmuMsgTypeEnum.otherJoin,
      //     msg: data.data && data.data.msg ? data.data.msg : "",
      //   },
      // ]);
    });

    // 用戶離開房間
    instance.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      console.log("【websocket】用戶離開房間", data);
      if (!instance) return;
      instance.socketIo?.emit(WsMsgTypeEnum.leave, {
        roomId: instance.roomId,
      });
    });

    // 用戶離開房間完成
    instance.socketIo.on(WsMsgTypeEnum.leaved, (data) => {
      console.log("【websocket】用戶離開房間完成", data);
      if (!instance) return;
      const res = liveUserList.filter(
        (item) => item.socketId !== data.socketId
      );
      // liveUserList = res;
      setLiveUserList(res);
      console.log("目前所有線上用戶", JSON.stringify(res));
      // setDamuList((prevDamuList) => [
      //   ...prevDamuList,
      //   {
      //     socketId: data.socketId,
      //     msgType: DanmuMsgTypeEnum.userLeaved,
      //     msg: "",
      //   },
      // ]);
    });
  }

  function startNewWebRtc(receiver: string) {
    console.warn("開始new WebRTCClass", receiver);
    // const rtc = new WebRTCClass({ roomId: `${roomId}___${receiver}` });
    const instance = webRtcService.connect({
      roomId: `${roomId}___${receiver}`,
      dispatch,
    });
    instance.rtcStatus.joined = true;
    instance.update();
    return instance;
  }

  function batchSendOffer() {
    liveUserList.forEach(async (item) => {
      if (!offerSended.has(item.socketId) && item.socketId !== getSocketId()) {
        startNewWebRtc(item.socketId);
        addTrack();
        console.warn("new WebRTCClass完成");
        console.log("執行sendOffer", {
          sender: getSocketId(),
          receiver: item.socketId,
        });
        sendOffer({ sender: getSocketId(), receiver: item.socketId });
        offerSended.add(item.socketId);
        setOfferSended(offerSended);
      }
    });
  }

  function addTrack() {
    if (!localStream) return;
    liveUserList.forEach((item) => {
      if (item.socketId !== getSocketId()) {
        localStream.getTracks().forEach((track) => {
          const rtc = webRtcService.getInstance(`${roomId}___${item.socketId}`);
          rtc?.addTrack(track, localStream);
        });
      }
    });
    // isAddTrack.value = true;
    setIsAddTrack(true);
  }

  async function sendOffer({
    sender,
    receiver,
  }: {
    sender: string;
    receiver: string;
  }) {
    if (isDone) return;
    if (!websocketInstance.current) return;
    const rtc = webRtcService.getInstance(`${roomId}___${receiver}`);
    if (!rtc) return;
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp);
    websocketInstance.current.send({
      msgType: WsMsgTypeEnum.offer,
      data: { sdp, sender, receiver },
    });
  }

  function sendJoin() {
    const instance = webSocketService.getInstance(roomId);

    if (!instance) return;
    instance.send({ msgType: WsMsgTypeEnum.join, data: {} });
  }

  function closeWs() {
    const instance = websocketInstance.current;
    if (!instance) return;
    instance.close();
  }

  const leftOptions = {
    roomId,
    getSocketId,
    localVideoRef,
    bottomRef,
    giftList,
    topRef,
  };

  const rightOptions = {
    liveUserList,
    damuList,
    danmuStr,
    setDanmuStr,
    sendDanmu,
    noticeMap,
  };

  useEffect(() => {
    getLiveRoomList();
  }, []);

  useEffect(() => {
    if (currentLiveRoom?.flvurl) {
      initFlvPlayer(currentLiveRoom.flvurl, localVideoRef.current);
    }
  }, [currentLiveRoom]);

  useEffect(() => {
    if (!topRef.current || !bottomRef.current || !localVideoRef.current) {
      return;
    }

    console.log("calculateAndSetHeight");
    const calculateAndSetHeight = () => {
      if (!bottomRef.current || !topRef.current || !localVideoRef.current) {
        return;
        console.log("666");
      }
      const res =
        bottomRef.current.getBoundingClientRect().top -
        (topRef.current.getBoundingClientRect().top +
          topRef.current.getBoundingClientRect().height);
      localVideoRef.current.style.height = `${res}px`;
    };

    const cleanup = () => {
      console.log("cleanup");
      if (!localVideoRef.current) {
        return;
      }
      // 移除事件監聽器以避免内存泄漏
      localVideoRef.current.removeEventListener("loadstart", handleLoadStart);
      localVideoRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      closeWs();
    };

    const handleLoadStart = () => {
      console.log("handleLoadStart");
      const rtc = webRtcService.getInstance(roomId);
      if (rtc) {
        rtc.rtcStatus.loadstart = true;
        rtc.update();
      }
    };

    const handleLoadedMetadata = () => {
      console.log("handleLoadedMetadata");
      const rtc = webRtcService.getInstance(roomId);
      if (rtc) {
        rtc.rtcStatus.loadedmetadata = true;
        rtc.update();
        batchSendOffer();
      }
    };

    calculateAndSetHeight();

    console.warn("開始new WebSocketClass");
    const intance = webSocketService.connect({
      roomId: roomId,
      url:
        process.env.NODE_ENV === "development"
          ? "ws://localhost:8080"
          : "ws://localhost:8080",
      isAdmin: false,
      dispatch,
    });
    websocketInstance.current = intance;
    initReceive();
    sendJoin();

    localVideoRef.current.addEventListener("loadstart", handleLoadStart);
    localVideoRef.current.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );
    // 設置清理函數
    return cleanup;
  }, []); // 確定並增加所有可能影響副作用的依賴項

  async function getLiveRoomList() {
    try {
      const res = await fetchLiveList({
        orderName: "created_at",
        orderBy: "desc",
      });

      if (res.code === 200) {
        if (Array.isArray(res.data.rows)) {
          const filteredRooms = res.data.rows.filter(
            (room: ILive) => room.roomId === roomId
          );
          // const mappedRooms = filteredRooms.map((room: ILive) => {
          //     return {
          //         id: room.id,
          //         name: room.socketId, // 假设你想要返回 socketId 作为 name
          //         // 添加其他你需要的字段
          //     };
          // });

          console.log("6666666666666666:", filteredRooms[0]);
          setCurrentLiveRoom((prev) => filteredRooms[0]);
        } else {
          console.error("Expected res.data.rows to be an array");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  return (
    <>
      {roomNoLive ? (
        <>
        <Link
                href=""
                className="btn btn-primary"
                role="button"
                onClick={() => {
                  window.location.href = "/live";
                }}
              >
                回大廳
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div>
              </Link>
          <div 
            style={{ 
              height: '80vh', 
              backgroundImage: 'url("/gif/old-paper02.jpg")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div >
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled
                >
                  目前房間沒在直播
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Link
            href=""
            className="btn btn-primary"
            role="button"
            onClick={() => {
              window.location.href = "/live";
            }}
          >
            回大廳
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>
          <div className={styles["pull-wrap"]}>
            <Left options={leftOptions} />
            <Right options={rightOptions} />
          </div>
        </>
      )}
    </>
  );
};

const Left = (props: any) => {
  const { getSocketId, roomId, giftList, topRef, localVideoRef, bottomRef } =
    props.options;
  return (
    <div className={`${styles.box} ${styles.left}`}>
      <div ref={topRef} className={styles.head}>
        <div className={styles.info}>
          <div className={styles.avatar}></div>
          <div className={styles.detail}>
            <div className={styles.top}>房間ID：{roomId}</div>
            <div className={styles.bottom}>
                <span>實況金鑰：{getSocketId()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles["video-wrap"]}>
        <video
          id="localVideo"
          ref={localVideoRef}
          className={styles.video}
          autoPlay
          webkit-playsinline="true"
          playsInline
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
          muted
          controls
        ></video>
      </div>

      <div ref={bottomRef} className={styles.gift}>
        {giftList.map((gift: any) => (
          <div className={styles.item} key={gift.name}>
            <div className={styles.ico}></div>
            <div className={styles.name}>{gift.name}</div>
            <div className={styles.price}>{gift.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Right = (props: any) => {
  const {
    liveUserList,
    damuList,
    noticeMap,
    sendDanmu,
    danmuStr,
    setDanmuStr,
  } = props.options;
  const listRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const { auth } = useAuth();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 6666666666666;
    }
  }, [damuList]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      sendDanmu(e);
    }
  };
  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionend") {
      setIsComposing(false);
    } else {
      setIsComposing(true);
    }
  };
  return (
    <div className={`${styles.box} ${styles.right}`}>
      <div className={styles["danmu-card"]}>
        <div className={styles.title}>聊天室</div>
        <div className={styles["list-wrap"]}>
          <div className={styles.list} ref={listRef}>
            {damuList?.map((item: any) => (
              <div className={styles.item} key={item.id}>
                <div>
                  <span className={styles.name}>
                    {/* {noticeMap[item.msgType]?.title || item.socketId}： */}
                    {noticeMap[item.msgType]?.title || item.login || auth.login || '遊客'}：
                  </span>
                  <span className={styles.msg}>
                    {noticeMap[item.msgType].subtitle || item.msg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles["send-msg"]}>
          <div className={styles.inputContainer}>
            <input
              value={danmuStr}
              onChange={(e: any) => setDanmuStr(e.target.value)}
              onKeyDown={handleKeyDown} // Attach handleKeyDown for Enter key
              className={`${styles.ipt} ${styles.effect20}`}
              onCompositionStart={handleComposition}
              onCompositionEnd={handleComposition}
              placeholder="請輸入訊息內容。。。" // Adding placeholder to match the new design
            />
            <label>請輸入訊息內容</label>
            <span className={styles.focusBorder}>
              <i></i>
            </span>
          </div>
          <Link
            href=""
            className="col-3 btn btn-primary m-2"
            role="button"
            onClick={sendDanmu}
          >
            傳送
            <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PullPage;
