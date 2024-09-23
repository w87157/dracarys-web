import {
  DanmuMsgTypeEnum,
  IAdminIn,
  ICandidate,
  IOffer,
  LiveTypeEnum,
} from "@/interfaces";
import Link from "next/link";
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from "@/network/webSocket";
import { use, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getRandomString } from "billd-utils";
import { webSocketService } from "@/lib/websocket-manager";
import { webRtcService } from "@/lib/webrtc-manager";
import styles from "@/styles/live/webrtc-push.module.scss";
import { useAuth } from '@/hooks/use-auth';

const allMediaTypeList = {
  [LiveTypeEnum.camera]: {
    type: LiveTypeEnum.camera,
    txt: "攝影機",
  },
  [LiveTypeEnum.screen]: {
    type: LiveTypeEnum.screen,
    txt: "視窗",
  },
};

const noticeMap = {
  [DanmuMsgTypeEnum.danmu]: { title: "", subtitle: "" },
  [DanmuMsgTypeEnum.otherJoin]: {
    title: "系统通知",
    subtitle: "進入直播房間！",
  },
  [DanmuMsgTypeEnum.userLeaved]: {
    title: "系统通知",
    subtitle: "離開直播房間！",
  },
};

type MediaType = {
  type: LiveTypeEnum;
  txt: string;
};

type User = {
  socketId: string;
  avatar: string;
  expr: number;
};

type Damu = {
  socketId: string;
  msgType: DanmuMsgTypeEnum;
  msg: string;
};

interface Props {
  name: string;
}

const Push: React.FC<Props> = () => {
  // const liveStore =
  // useSelector((state: RootState) => state.liveReducer) ;
  const dispatch = useDispatch();

  const roomNameBtnRef = useRef<HTMLButtonElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const roomNameRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [websocketInstance, setWebsocketInstance]: [
    WebSocketClass | undefined,
    React.Dispatch<React.SetStateAction<WebSocketClass | undefined>>
  ] = useState<WebSocketClass | undefined>();
  const [currMediaType, setCurrMediaType]: [
    MediaType,
    React.Dispatch<React.SetStateAction<MediaType>>
  ] = useState<MediaType>(allMediaTypeList[LiveTypeEnum.camera]);
  const [currMediaTypeList, setCurrMediaTypeList]: [
    MediaType[],
    React.Dispatch<React.SetStateAction<MediaType[]>>
  ] = useState<MediaType[]>([]);
  const [liveUserList, setLiveUserList]: [
    User[],
    React.Dispatch<React.SetStateAction<User[]>>
  ] = useState<User[]>([]);
  const [damuList, setDamuList]: [
    Damu[],
    React.Dispatch<React.SetStateAction<Damu[]>>
  ] = useState<Damu[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  // const [joined, setJoined] = useState<boolean>(false);
  const joined = useRef<boolean>(false);
  const [danmuStr, setDanmuStr] = useState<string>("");
  const [roomNoLive, setRoomNoLive] = useState(false);
  const [offerSended, setOfferSended] = useState(new Set());
  const [localStream, setlocalStream] = useState<MediaStream | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>(getRandomString(15));
 
  function sendJoin() {
    
    const instance = webSocketService.getInstance(roomId);
    if (!instance) return;
    instance.send({
      msgType: WsMsgTypeEnum.join,
      data: {
        roomName: roomName,
        coverImg: handleCoverImg(),
      },
    });
  }

  function handleCoverImg() {
    if (!localVideoRef.current) {
      return;
    }
    const canvas = document.createElement("canvas");
    const { width = 0, height = 100 } =
      localVideoRef.current.getBoundingClientRect() || {};
    const rate = width / height;
    const coverWidth = width * 0.5;
    const coverHeight = coverWidth / rate;
    canvas.width = coverWidth;
    canvas.height = coverHeight;
    canvas
      .getContext("2d")!
      .drawImage(localVideoRef.current, 0, 0, coverWidth, coverHeight);
    // webp比png的體積小非常多！因此coverWidth就可以不用壓縮太誇張
    const dataURL = canvas.toDataURL("image/webp");
    return dataURL;
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
  }

  async function sendOffer({
    sender,
    receiver,
  }: {
    sender: string;
    receiver: string;
  }) {
    if (isDone) return;
    if (!websocketInstance) return;
    const rtc = webRtcService.getInstance(`${roomId}___${receiver}`);
    if (!rtc) return;
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp);
    websocketInstance.send({
      msgType: WsMsgTypeEnum.offer,
      data: { sdp, sender, receiver },
    });
  }

  function batchSendOffer() {
    console.log("11111");

    liveUserList.forEach(async (item) => {
      console.log("22222");
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

  function startNewWebRtc(receiver: string) {
    console.warn("開始new WebRTCClass", receiver);
    const instance = webRtcService.connect({
      roomId: `${roomId}___${receiver}`,
      dispatch,
    });
    // const rtc = new WebRTCClass({ roomId: `${roomId}___${receiver}` });
    instance.rtcStatus.joined = true;
    instance.update();
    return instance;
  }

  /** 攝影機 */
  // startGetUserMedia
  async function startGetUserMedia() {
    if (!localStream) {
      // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000區網無法使用
      const event = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("getUserMedia成功", event);
      setCurrMediaType(allMediaTypeList[LiveTypeEnum.camera]);
      // TODO 需要檢驗
      setCurrMediaTypeList([
        ...currMediaTypeList,
        allMediaTypeList[LiveTypeEnum.camera],
      ]);
      // TODO nextjs ref代替方案 程式邏輯問題
      if (!localVideoRef.current) return;
      localVideoRef.current.srcObject = event;
      setlocalStream(event);
    }
  }
  // startGetDisplayMedia
  async function startGetDisplayMedia() {
    if (!localStream) {
      // WARN navigator.mediaDevices.getDisplayMedia在localhost和https才能用，http://192.168.1.103:8000區網無法使用
      const event = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      console.log("getDisplayMedia成功", event);

      // currMediaType = allMediaTypeList[LiveTypeEnum.screen];
      setCurrMediaType(allMediaTypeList[LiveTypeEnum.screen]);
      currMediaTypeList.push(allMediaTypeList[LiveTypeEnum.screen]);

      // TODO nextjs ref代替方案
      if (!localVideoRef.current) return;
      localVideoRef.current.srcObject = event;

      // localStream = event;
      setlocalStream(event);
    }
  }

  function roomNameIsOk() {
    if (!roomName.length) {
      alert("請輸入房間名稱！");
      return false;
    }
    if (roomName.length < 3 || roomName.length > 10) {
      alert("房間名稱要求3-10個字！");
      return false;
    }
    return true;
  }

  // confirmRoomName
  function confirmRoomName(e:any) {
    e.preventDefault();
    if (!roomNameIsOk()) return;

    // TODO nextjs ref代替方案 程式邏輯問題？
    if (!roomNameRef.current) return;
    roomNameRef.current.disabled = true;
  }

  // getSocketId
  function getSocketId() {
    return websocketInstance!?.socketIo?.id || "-1";
  }

  function initReceive() {
    console.log("initReceive", websocketInstance);
    const instance = websocketInstance;
    if (!instance?.socketIo) return;

    console.log("initReceive websocket連接成功");
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
    instance.socketIo.on(WsMsgTypeEnum.liveUser, () => {
      console.log("【websocket】目前所有線上用戶");
      if (!instance) return;
    });

    // 收到offer
    instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
      console.warn("【websocket】收到offer", data);
      if (!instance) return;
      if (data.data.receiver === getSocketId()) {
        console.log("收到offer，這個offer是傳給我的");
        const rtc = startNewWebRtc(data.data.sender);
        await rtc.setRemoteDescription(data.data.sdp);
        const sdp = await rtc.createAnswer();
        await rtc.setLocalDescription(sdp);
        websocketInstance?.send({
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
            // rtc.handleStream();
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

    // 用戶加入房間
    instance.socketIo.on(WsMsgTypeEnum.join, (data) => {
      console.log("【websocket】用戶加入房間", data);
      if (!instance) return;
    });

    // 用戶加入房間
    instance.socketIo.on(WsMsgTypeEnum.joined, (data) => {
      console.log("【websocket】用戶加入房間完成", data);
      // joined = true;
      joined.current = true;

      setLiveUserList([
        ...liveUserList,
        {
          avatar: "red",
          socketId: `${getSocketId()}`,
          expr: 1,
        },
      ]);
      // setLiveUserList([
      //   ...liveUserList,
      //   {
      //     avatar: "red",
      //     socketId: `${getSocketId()}`,
      //     expr: 1,
      //   },
      // ]);
      batchSendOffer();
    });

    // 其他用戶加入房間
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
      console.log("【websocket】其他用戶加入房間", data);
      liveUserList.push({
        avatar: "red",
        socketId: data.socketId,
        expr: 1,
      });
      // setLiveUserList(liveUserList);
      // setDamuList((prevDamuList) => [
      //   ...prevDamuList,
      //   {
      //     socketId: data.socketId,
      //     msgType: DanmuMsgTypeEnum.otherJoin,
      //     msg: "",
      //     login: auth.login
      //   },
      // ]);
      console.log("目前所有線上用戶", JSON.stringify(liveUserList));
      console.log("batch ????:", batchSendOffer);

      if (joined) {
        batchSendOffer();
      }
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
      console.log("目前所有線上用戶", JSON.stringify(res));
      // liveUserList = res;
      setLiveUserList(res);
      // setDamuList((prevDamuList) => [
      //   ...prevDamuList,
      //   {
      //     id: data.id,
      //     socketId: data.socketId,
      //     msgType: DanmuMsgTypeEnum.userLeaved,
      //     msg: "",
      //   },
      // ]);
    });
  }

  // function up

  // startLive;
  function startLive(e:any) {
    e.preventDefault();
    if (!roomNameIsOk()) return;
    if (!currMediaTypeList.length) {
      alert("請選擇一個設備！");
      return;
    }
    roomNameBtnRef.current!.disabled = true;
    const options = {
      roomId,
      url:
        process.env.NODE_ENV === "development"
          ? "ws://localhost:8080"
          : "ws://localhost:8080",
      isAdmin: true,
      dispatch,
    };

    const instance = webSocketService.connect(options);
    setWebsocketInstance(instance);
    websocketInstance?.update();
    console.log("websocketInstance", websocketInstance);
    initReceive();
    sendJoin();
    setTimeout(() => {
      handleCoverImg();
    }, 0);
  }

  function closeWs() {
    const instance = websocketInstance;
    if (!instance) return;
    instance.close();
  }
  function closeRtc() {
    const rtcMap = webRtcService.getPool();
    Object.keys(rtcMap).forEach((key) => {
      rtcMap[key].close();
    });
  }

  /** 结束直播 */
  function endLive() {
    window.location.reload();
  }

  // sendDanmu
  function sendDanmu(e: any) {
    e.preventDefault();
    if (!danmuStr.length) {
      alert("請輸入訊息内容！");
      return;
    }
    if (!websocketInstance) return;
    websocketInstance.send({
      msgType: WsMsgTypeEnum.message,
      data: { login: auth.login? auth.login: '遊客' , msg: danmuStr  },
    });

    // damuList.push({
    //   socketId: getSocketId(),
    //   msgType: DanmuMsgTypeEnum.danmu,
    //   msg: danmuStr,
    // });
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

  async function getAllMediaDevices() {
    const res = await navigator.mediaDevices.enumerateDevices();
    const audioInput = res.filter(
      (item) => item.kind === "audioinput" && item.deviceId !== "default"
    );
    const videoInput = res.filter(
      (item) => item.kind === "videoinput" && item.deviceId !== "default"
    );
    console.log(audioInput, videoInput, res);
    return res;
  }

  async function init() {
    if (!topRef.current || !bottomRef.current || !localVideoRef.current) {
      return;
    }
    const all = await getAllMediaDevices();
    allMediaTypeList[LiveTypeEnum.camera] = {
      txt: all.find((item) => item.kind === "videoinput")?.label || "攝影機",
      type: LiveTypeEnum.camera,
    };
    if (topRef && bottomRef && localVideoRef) {
      const res =
        bottomRef.current!.getBoundingClientRect().top -
        topRef.current!.getBoundingClientRect().top;
      localVideoRef.current!.style.height = `${res}px`;
    }
    localVideoRef?.current.addEventListener("loadstart", () => {
      console.warn("視訊流-loadstart");
      const rtc = webRtcService.getInstance(roomId);
      if (!rtc) return;
      rtc.rtcStatus.loadstart = true;
      rtc.update();
    });

    localVideoRef.current?.addEventListener("loadedmetadata", () => {
      console.warn("視訊流-loadedmetadata");
      const rtc = webRtcService.getInstance(roomId);
      if (!rtc) return;
      rtc.rtcStatus.loadedmetadata = true;
      rtc.update();
      batchSendOffer();
    });
  }

  useEffect(() => {
    init();

    return () => {
      closeWs();
      closeRtc();
    };
  }, [localVideoRef]);

  useEffect(() => {
    initReceive();
  }, [websocketInstance]);

  const optionsLeft = {
    currMediaTypeList,
    startGetUserMedia,
    startGetDisplayMedia,
    confirmRoomName,
    getSocketId,
    liveUserList,
    startLive,
    roomName,
    roomNameBtnRef,
    roomNameRef,
    setRoomName,
    localVideoRef,
    topRef,
    endLive,
  };

  const optionsRight = {
    Right,
    currMediaTypeList,
    damuList,
    sendDanmu,
    danmuStr,
    noticeMap,
    setDanmuStr,
  };
  const { auth } = useAuth();

  return (
    <>
      {auth.login ? (
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
          <div className={styles["push-wrap"]}>
            <Left options={optionsLeft} />
            <Right options={optionsRight} />
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
          </Link>          <div 
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
                  data-bs-toggle="modal"
                  data-bs-target="#memberModal"
                  disabled
                >
                  請先登入
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
  
};

const Left = (props: any) => {
  const { auth } = useAuth();
  const {
    startGetUserMedia,
    startGetDisplayMedia,
    confirmRoomName,
    getSocketId,
    startLive,
    endLive,
    roomNameBtnRef,
    roomNameRef,
    roomName,
    setRoomName,
    localVideoRef,
    topRef,
    bottomRef,
    liveUserList,
    currMediaTypeList,
  } = props.options;
  const [offcanvas, setOffcanvas] = useState(null);

  return (
    <div className={`${styles.box} ${styles.left}`} ref={topRef}>
      <div className={styles["video-wrap"]}>
        <video
          className={styles.video}
          ref={localVideoRef}
          id={styles.localVideo}
          autoPlay
          // style={{ height: '580px' }}
          webkit-playsinline="true"
          playsInline
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
          muted
          controls
        ></video>
        {currMediaTypeList.length <= 0 && (
          <div className={styles["add-wrap"]}>
            {/* <div className={styles.item} onClick={startGetUserMedia}>
              攝影機
            </div> */}
            <Link
              href=""
              className="btn btn-primary"
              onClick={startGetUserMedia}
              role="button"
            >
              攝影機
              <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>            {/* <div className={styles.item} onClick={startGetDisplayMedia}>
              螢幕
            </div> */}
            <Link
              href=""
              className="btn btn-primary"
              onClick={startGetDisplayMedia}
              role="button"
            >
              螢幕
              <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>          </div>
        )}
      </div>
      <div className={styles.control} ref={bottomRef}>
        <div className={styles.info}>

          <div className={styles.detail}>
            <div className={styles.top}>
              
              <div className={styles.inputContainer}>
            <input
              value={roomName}
              ref={roomNameRef}
              onChange={(e: any) => setRoomName(e.target.value)}
              className={`${styles.ipt} ${styles.effect20}`}
              placeholder="請輸入房間名稱" // Adding placeholder to match the new design
            />
            <label>請輸入訊息內容</label>
            <span className={styles.focusBorder}>
              <i></i>
            </span>
          </div>
              <Link
                ref={roomNameBtnRef}
                href=""
                className="btn btn-primary w-50"
                role="button"
                onClick={confirmRoomName}
              >
                確定
                <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>              <div className={styles.bottom}>
                <span>實況金鑰：{getSocketId()}</span>
            </div>
            </div>
          </div>
        </div>
        <div className={styles.other} id={styles.other}>
          <div className={styles.top}>
            <div className={styles.item}>
              {getSocketId() !== "-1" ? (
                <i className={styles.icoRed}></i>
              ) : (
                <i className={styles.icoGrey}></i>
              )}
              <i className={styles.ico}></i>
              {/*  bug 待修 */}
              {/* <div className={styles.counts}>
                觀看人數：{liveUserList?.length}
              </div> */}
            </div>
          </div>
          {/*  <button onClick={endLive}>结束直播</button> */}
          
            {getSocketId() !== "-1" ? (
              <Link
                href=""
                className=" btn btn-primary"
                role="button"
                onClick={endLive}
              >
                結束直播
                <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>            ) : (
                <Link
                href=""
                className="btn btn-primary w-110"
                role="button"
                onClick={startLive}
              >
                開始直播
                <div className="button__horizontal"></div>
            <div className="button__vertical"></div>
          </Link>              
              // <button onClick={startLive}>開始直播</button>
            )}
          
        </div>
      </div>
    </div>
  );
};

const Right = (props: any) => {
  const { noticeMap, sendDanmu, damuList, danmuStr, setDanmuStr } =
    props.options;
  const listRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const { auth } = useAuth();

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 6666666666666; // 滾動到頂部
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
                <span className={styles.name}>
                  {/* {noticeMap[item.msgType]?.title || item.socketId}： */}
                  {/* 聊天內容使用玩家帳號 */}
                  {noticeMap[item.msgType]?.title || item.login || auth.login}：
                </span>
                <span className={styles.msg}>
                  { noticeMap[item.msgType].subtitle || item.msg}
                </span>
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

export default Push;
