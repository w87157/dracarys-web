import browserTool from 'browser-tool';

// import { useNetwork } from '@/store/network';

import { WsMsgTypeEnum } from "./webSocket";
import { Dispatch } from "@reduxjs/toolkit";
import { webSocketService } from '@/lib/websocket-manager';

function prettierInfo(
  str: string,
  data: {
    browser: string;
  },
  type?: "log" | "warn" | "error",
  ...args: undefined[]
) {
  console[type || "log"](
    `${new Date().toLocaleString()}，${data.browser}瀏覽器，${str}`,
    ...args
  );
}

export const frontendErrorCode = {
  rtcStatusErr: {
    // rtcStatus沒有100%
    code: 1001,
    msg: "連接錯誤，是否嘗試刷新頁面",
    refresh: true,
  },
  streamStop: {
    // 影片流卡住
    code: 1002,
    msg: "網路不穩，建議更換網路或是刷新頁面",
    refresh: true,
  },
  blackScreen: {
    // 影片流當機
    code: 1003,
    msg: "目前瀏覽器似乎不兼容，建議使用 Chrome",
    refresh: false,
  },
  connectionStateFailed: {
    code: 1004,
    msg: "連接錯誤，是否嘗試刷新頁面",
    refresh: true,
  },
  iceConnectionStateDisconnected: {
    code: 1005,
    msg: "連接錯誤，是否嘗試刷新頁面",
    refresh: true,
  },
  getStatsErr: {
    code: 1006,
    msg: "連接錯誤，是否嘗試刷新頁面",
    refresh: true,
  },
  connectLongTime: {
    // 5秒内沒有收到loadedmetadata call back
    code: 1007,
    msg: "等待太久，是否刷新頁面重試？",
    refresh: true,
  },
};

export class WebRTCClass {
  roomId = "-1";
  dispatch;
  peerConnection: RTCPeerConnection | null = null;
  dataChannel: RTCDataChannel | null = null;

  candidateFlag = false;

  sender?: RTCRtpTransceiver;

  getStatsSetIntervalDelay = 1000;
  getStatsSetIntervalTimer: NodeJS.Timeout | undefined;

  // getStatsSetIntervalDelay是1秒的話，forceINumsMax是3，就代表一直卡了3秒。
  forceINums = 0; // 傳送forceI次數
  forceINumsMax = 3; // 最多傳送幾次forceI

  preFramesDecoded = -1; // 上一幀

  browser: {
    device: string;
    language: string;
    engine: string;
    browser: string;
    system: string;
    systemVersion: string;
    platform: string;
    isWebview: boolean;
    isBot: boolean;
    version: string;
  };

  rtcStatus = {
    key: false,
    joined: false, // true代表成功，false代表失敗
    icecandidate: false, // true代表成功，false代表失敗
    createOffer: false, // true代表成功，false代表失拜
    setLocalDescription: false, // true代表成功，false代表失敗
    answer: false, // true代表成功，false代表失敗
    setRemoteDescription: false, // true代表成功，false代表失敗
    addStream: false, // true代表成功，false代表失敗
    loadstart: false, // true代表成功，false代表失敗
    loadedmetadata: false, // true代表成功，false代表失敗
  };

  localDescription: any;

  constructor({ roomId, dispatch }: { roomId: string; dispatch: Dispatch }) {
    this.roomId = roomId;
    this.browser = browserTool();
    this.createPeerConnection();
    this.update();
    this.dispatch = dispatch;
    // this.handleWebRtcError();
    // this.networkStore = networkStore;
  }

  addTrack = (track: string | MediaStreamTrack, stream: MediaStream) => {
    console.warn("addTrackaddTrack", track, stream);
    this.sender = this.peerConnection?.addTransceiver(track, {
      streams: [stream],
      direction: "sendonly",
    });
    // this.peerConnection?.addTrack(track, stream);
  };

  handleWebRtcError = () => {
    this.getStatsSetIntervalTimer = setInterval(() => {
      this.peerConnection
        ?.getStats()
        .then((res) => {
          let isBlack = false;
          let currFramesDecoded = -1;
          res.forEach((report: RTCInboundRtpStreamStats) => {
            // 不能结構report的值，不然如果卡住之後，report的值就一直都是
            // const { type, kind, framesDecoded } = report;
            const data = {
              type: report.type,
              kind: report.kind,
              framesDecoded: report.framesDecoded,
              decoderImplementation: report.decoderImplementation,
              isChrome: false,
              isSafari: false,
              other: "",
            };
            if (this.browser.browser === "safari") {
              data.isSafari = true;
            } else if (this.browser.browser === "chrome") {
              data.isChrome = true;
            } else {
              data.other = this.browser.browser;
            }
            const isStopFlag = this.getCurrentFramesDecoded(data);
            const isBlackFlag = this.isBlackScreen(data);
            if (isStopFlag !== false) {
              currFramesDecoded = isStopFlag;
            }
            if (isBlackFlag !== false) {
              isBlack = isBlackFlag;
            }
          });
          /** 处理影片流卡住 */
          const handleStreamStop = () => {
            // console.error(
            //   `上一幀：${this.preFramesDecoded}，目前幀:${currFramesDecoded}，forceINums：${this.forceINums}`
            // );
            if (this.preFramesDecoded === currFramesDecoded) {
              if (this.forceINums >= this.forceINumsMax) {
                prettierInfo(
                  "超過forceI次數，提示更换網路",
                  { browser: this.browser.browser },
                  "warn"
                );
                this.forceINums = 0;
              } else {
                this.forceINums += 1;
                prettierInfo(
                  `目前影片流卡住了，住動刷新云手机（${this.forceINums}/${this.forceINumsMax}）`,
                  { browser: this.browser.browser },
                  "warn"
                );
              }
            } else {
              this.forceINums = 0;
              // console.warn('影片流沒有卡住');
            }
            this.preFramesDecoded = currFramesDecoded;
          };
          /** 处理黑屏 */
          const handleBlackScreen = () => {
            if (isBlack) {
              prettierInfo(
                "黑屏了",
                { browser: this.browser.browser },
                "error"
              );
            }
            // else {
            //   console.warn('沒有黑屏');
            // }
          };
          /** 处理rtcStatus */
          const handleRtcStatus = () => {
            const res = this.rtcStatusIsOk();
            const length = Object.keys(res).length;
            if (length) {
              prettierInfo(
                `rtcStatus错误：${Object.keys(res).join()}`,
                { browser: this.browser.browser },
                "error"
              );
            }
            //  else {
            //   console.warn('rtcStatus正常');
            // }
          };
          handleStreamStop();
          handleBlackScreen();
          handleRtcStatus();
          // if (!networkStore.errorCode.length) {
          //   networkStore.setShowErrorModal(false);
          // }
        })
        .catch((err) => {
          console.error(new Date().toLocaleString(), "getStatsErr", err);
          // networkStore.setErrorCode(frontendErrorCode.getStatsErr);
          // networkStore.setShowErrorModal(true);
        });
    }, this.getStatsSetIntervalDelay);
  };

  /** rtcStatus是否都是true了 */
  rtcStatusIsOk = () => {
    const res: Partial<typeof this.rtcStatus> = {};
    const status = this.rtcStatus;

    (Object.keys(status) as Array<keyof typeof status>).forEach((key) => {
      if (!status[key]) {
        res[key] = false;
      }
    });

    return res;
  };

  /** 目前是否黑屏,true代表黑屏了，false代表沒有黑屏 */
  isBlackScreen = ({
    type = "",
    kind = "",
    framesDecoded = 0,
    isSafari = false,
    isChrome = false,
  }) => {
    // https://blog.csdn.net/weixin_44523653/article/details/127414387
    // console.warn(
    //   // eslint-disable-next-line
    //   `type:${type},kind:${kind},framesDecoded:${framesDecoded},decoderImplementation:${decoderImplementation}`
    // );
    if (isSafari) {
      if (
        type === "inbound-rtp" &&
        kind === "video" &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        return true;
      }
    } else if (isChrome) {
      if (
        (type === "track" || type === "inbound-rtp") &&
        kind === "video" &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        return true;
      }
    } else {
      if (
        (type === "track" || type === "inbound-rtp") &&
        kind === "video" &&
        // framesDecoded等于0代表黑屏
        framesDecoded === 0
      ) {
        // 安卓的qq瀏覽器适用這個黑屏判断
        return true;
      }
    }

    return false;
  };

  /** 获取目前幀 */
  getCurrentFramesDecoded = ({
    type = "",
    kind = "",
    framesDecoded = this.preFramesDecoded,
    isSafari = false,
    isChrome = false,
  }) => {
    if (isSafari) {
      if (type === "inbound-rtp" && kind === "video") {
        return framesDecoded;
      }
    } else if (isChrome) {
      if ((type === "track" || type === "inbound-rtp") && kind === "video") {
        return framesDecoded;
      }
    } else {
      if ((type === "track" || type === "inbound-rtp") && kind === "video") {
        // 安卓的qq瀏覽器适用這個卡屏判断
        return framesDecoded;
      }
    }
    return false;
  };

  // 創建offer
  createOffer = async () => {
    if (!this.peerConnection) return;
    prettierInfo("createOffer開始", { browser: this.browser.browser }, "warn");
    try {
      const description = await this.peerConnection.createOffer({
        iceRestart: true,
      });
      // const description = await this.peerConnection.createOffer({
      //   iceRestart: true,
      //   offerToReceiveAudio: true,
      //   offerToReceiveVideo: true,
      // });
      this.localDescription = description;
      this.rtcStatus.createOffer = true;
      this.update();
      prettierInfo(
        "createOffer成功",
        { browser: this.browser.browser },
        "warn"
      );
      console.log("createOffer", description);
      return description;
    } catch (error) {
      prettierInfo(
        "createOffer失敗",
        { browser: this.browser.browser },
        "error"
      );
      console.log(error);
    }
  };

  // 設置本地描述
  setLocalDescription = async (description: RTCLocalSessionDescriptionInit | undefined) => {
    if (!this.peerConnection) return;
    prettierInfo(
      "setLocalDescription開始",
      { browser: this.browser.browser },
      "warn"
    );
    try {
      await this.peerConnection.setLocalDescription(description);
      this.rtcStatus.setLocalDescription = true;
      this.update();
      prettierInfo(
        "setLocalDescription成功",
        { browser: this.browser.browser },
        "warn"
      );
      console.log(description);
    } catch (error) {
      prettierInfo(
        "setLocalDescription失敗",
        { browser: this.browser.browser },
        "error"
      );
      console.log("setLocalDescription", description);
      console.log(error);
    }
  };

  // 創建answer
  createAnswer = async () => {
    if (!this.peerConnection) return;
    prettierInfo("createAnswer開始", { browser: this.browser.browser }, "warn");
    try {
      const description = await this.peerConnection.createAnswer();
      this.update();
      prettierInfo(
        "createAnswer成功",
        { browser: this.browser.browser },
        "warn"
      );
      console.log(description);
      return description;
    } catch (error) {
      prettierInfo(
        "createAnswer失敗",
        { browser: this.browser.browser },
        "error"
      );
      console.log(error);
    }
  };

  // 設置远端描述
  setRemoteDescription = async (description: RTCSessionDescriptionInit) => {
    if (!this.peerConnection) return;
    prettierInfo(
      `setRemoteDescription開始`,
      { browser: this.browser.browser },
      "warn"
    );
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(description)
      );
      this.rtcStatus.setRemoteDescription = true;
      this.update();
      prettierInfo(
        "setRemoteDescription成功",
        { browser: this.browser.browser },
        "warn"
      );
      console.log(description);
    } catch (error) {
      prettierInfo(
        "setRemoteDescription失敗",
        { browser: this.browser.browser },
        "error"
      );
      console.log("setRemoteDescription", description);
      console.log(error);
    }
  };

  addStream = (stream: MediaProvider | null) => {
    if (!this.peerConnection) return;
    // if (!this.peerConnection || this.rtcStatus.addStream) return;
    this.rtcStatus.addStream = true;
    this.update();
    console.log("addStreamaddStreamaddStream", stream);
    document.querySelector<HTMLVideoElement>("#localVideo")!.srcObject = stream;
    prettierInfo("addStream成功", { browser: this.browser.browser }, "warn");
  };

  handleStream = () => {
    console.warn(`${this.roomId}，開始監聽pc的addstream`);
    this.peerConnection?.addEventListener("addstream", (event: any) => {
      console.warn(`${this.roomId}，pc收到addstream事件`, event, event.stream);
      this.addStream(event.stream);
    });

    console.warn(`${this.roomId}，開始監聽pc的ontrack`);
    this.peerConnection?.addEventListener("ontrack", (event: any) => {
      console.warn(`${this.roomId}，pc收到ontrack事件`, event);
      this.addStream(event.streams[0]);
    });

    console.warn(`${this.roomId}，開始監聽pc的addtrack`);
    this.peerConnection?.addEventListener("addtrack", (event: any) => {
      console.warn(`${this.roomId}，pc收到addtrack事件`, event);
    });

    console.warn(`${this.roomId}，開始監聽pc的track`);
    this.peerConnection?.addEventListener("track", (event: any) => {
      console.warn(`${this.roomId}，pc收到track事件`, event);
      this.addStream(event.streams[0]);
      // document.querySelector<HTMLVideoElement>('#localVideo')!.srcObject =
      //   event.streams[0];
    });
  };

  // 創建連接
  startConnect = () => {
    if (!this.peerConnection) return;
    console.warn(`${this.roomId}，開始監聽pc的icecandidate`);
    this.peerConnection.addEventListener("icecandidate", (event) => {
      prettierInfo(
        "pc收到icecandidate",
        { browser: this.browser.browser },
        "warn"
      );
      this.rtcStatus.icecandidate = true;
      this.update();
      if (event.candidate) {
        // const networkStore = useNetwork();
        this.candidateFlag = true;
        this.update();
        console.log("準備傳送candidate", event.candidate.candidate);
        const data = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          // sender: networkStore.wsMap.get(this.roomId)?.socketIo?.id,
        };
        const roomId = this.roomId.split("___")[0];
        webSocketService.getInstance(roomId)

          ?.send({ msgType: WsMsgTypeEnum.candidate, data });
      } else {
        console.log("沒有候選者了");
      }
    });

    this.handleStream();

    // connectionstatechange
    this.peerConnection.addEventListener(
      "connectionstatechange",
      (event: any) => {
        prettierInfo(
          "pc收到connectionstatechange",
          { browser: this.browser.browser },
          "warn"
        );
        const connectionState = event.currentTarget.connectionState;
        const iceConnectionState = event.currentTarget.iceConnectionState;
        console.log(
          // eslint-disable-next-line
          `connectionState:${connectionState}, iceConnectionState:${iceConnectionState}`
        );
        if (connectionState === "connected") {
          console.warn("connectionState:connected");
        }
        if (connectionState === "failed") {
          // 失敗
          console.error("connectionState:failed", event);
        }
        if (iceConnectionState === "disconnected") {
          // 已斷線，請重新連接
          console.error("iceConnectionState:disconnected", event);
        }
      }
    );
  };

  // 創建對等連接
  createPeerConnection = () => {
    if (!window.RTCPeerConnection) {
      console.error("目前環境不支援RTCPeerConnection！");
      alert("目前環境不支援RTCPeerConnection！");
      return;
    }
    if (!this.peerConnection) {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          // {
          //   urls: 'stun:stun.l.google.com:19302',
          // },
          {
            urls: "turn:hsslive.cn:3478",
            username: "hss",
            credential: "123456",
          },
        ],
      });
      // this.dataChannel =
      //   this.peerConnection.createDataChannel('MessageChannel');

      // this.dataChannel.onopen = (event) => {
      //   console.warn('dataChannel---onopen', event);
      // };
      // this.dataChannel.onerror = (event) => {
      //   console.warn('dataChannel---onerror', event);
      // };
      // this.dataChannel.onmessage = (event) => {
      //   console.log('dataChannel---onmessage', event);
      // };
      // this.peerConnection.addTransceiver('video', { direction: 'recvonly' });
      // this.peerConnection.addTransceiver('audio', { direction: 'recvonly' });
      this.startConnect();
      this.update();
    }
  };

  // 手動關閉webrtc連接
  close = () => {
    console.warn(`${new Date().toLocaleString()}，手動關閉webrtc連接`);
    if (this.sender?.sender) {
      this.peerConnection?.removeTrack(this.sender?.sender);
    }
    this.peerConnection?.close();
    this.dataChannel?.close();
    this.peerConnection = null;
    this.dataChannel = null;
    this.update();
  };

  // 更新store
  update = () => {
    const {
      roomId,
      candidateFlag,
      getStatsSetIntervalDelay,
      forceINums,
      forceINumsMax,
      preFramesDecoded,
      browser,
      rtcStatus,
    } = this;
    // this.dispatch(
    //   updateWrcMap({
    //     roomId,
    //     arg: {
    //       roomId,
    //       candidateFlag,
    //       getStatsSetIntervalDelay,
    //       forceINums,
    //       forceINumsMax,
    //       preFramesDecoded,
    //       browser,
    //       rtcStatus,
    //     },
    //   })
    // );
  };
}
