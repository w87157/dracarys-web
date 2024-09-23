import { Dispatch } from "@reduxjs/toolkit";
import { updateWsMap } from "@/lib/live-slice";
// import { useDispatchNetwork, useNetwork } from "components/_nextwork";
// import { updateRtcMap, updateWsMap } from "lib/network-slice";
import { Socket, io } from "socket.io-client";

// websocket連接狀態
export enum WsConnectStatusEnum {
  /** 已連接 */
  connection = "connection",
  /** 連接中 */
  connecting = "connecting",
  /** 已連接 */
  connected = "connected",
  /** 斷線中 */
  disconnecting = "disconnecting",
  /** 已斷線 */
  disconnect = "disconnect",
  /** 重新連接 */
  reconnect = "reconnect",
  /** 客戶端的已連接 */
  connect = "connect",
}

// websocket消息類型
export enum WsMsgTypeEnum {
  /** 用戶進入聊天 */
  join = "join",
  /** 用戶進入聊天完成 */
  joined = "joined",
  /** 用戶進入聊天 */
  otherJoin = "otherJoin",
  /** 用戶退出聊天 */
  leave = "leave",
  /** 用戶退出聊天完成 */
  leaved = "leaved",
  /** 目前所有在線用戶 */
  liveUser = "liveUser",
  /** 用戶傳送消息 */
  message = "message",
  /** 房間正在直播 */
  roomLiveing = "roomLiveing",
  /** 房間不在直播 */
  roomNoLive = "roomNoLive",
  /** sendBlob */
  sendBlob = "sendBlob",
  offer = "offer",
  answer = "answer",
  candidate = "candidate",
}

type TWebSocketOptions = {
  roomId: string;
  url: string;
  isAdmin: boolean;
  dispatch: Dispatch;
};

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: WsConnectStatusEnum = WsConnectStatusEnum.disconnect;
  url = "";

  roomId = "-1";
  isAdmin = false;

  dispatch;

  constructor({ roomId, url, isAdmin, dispatch }: TWebSocketOptions) {
    if (!window.WebSocket) {
      alert("目前環境不支援WebSocket！");
      return;
    }
    this.roomId = roomId;
    this.isAdmin = isAdmin;
    this.url = url;
    this.dispatch = dispatch;
    console.log(this.url);

    console.log("Connecting to WebSocket server at:", url);
    console.log(this.socketIo);

    this.socketIo = io(url, { transports: ["websocket"], forceBase64: false });
    this.socketIo.on("connect", () => {});
    // this.socketIo.listeners("connect").;
    // this.update();
  }

  // 傳送websocket消息
  send = ({ msgType, data }: { msgType: WsMsgTypeEnum; data?: any }) => {
    console.log("【websocket】傳送websocket消息", msgType, data);
    this.socketIo?.emit(msgType, {
      roomId: this.roomId,
      socketId: this.socketIo.id,
      data,
      isAdmin: this.isAdmin,
    });
  };

  // 更新store
  update = () => {
    const { status, url, roomId, isAdmin } = this;
    this.dispatch &&
      this.dispatch(
        updateWsMap({ roomId, arg: { status, url, roomId, isAdmin } })
      );
  };

  // 手動關閉websocket連接
  close = () => {
    console.warn("手動關閉websocket連接", this.socketIo?.id);
    this.socketIo?.close();
  };

  // 連接websocket
  connect = () => {};
}
