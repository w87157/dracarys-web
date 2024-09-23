import { Dispatch } from "@reduxjs/toolkit";
import { TWebSocketOptions } from "@/interfaces";
import { WebSocketClass, WsMsgTypeEnum } from "@/network/webSocket";

class WebsocketService {
  private websocketPool: {
    [key: string]: WebSocketClass;
  };
  constructor() {
    this.websocketPool = {};
  }

  connect({ roomId, url, isAdmin, dispatch }: TWebSocketOptions) {
    const instance = new WebSocketClass({
      roomId: roomId,
      url,
      isAdmin,
      dispatch,
    });
    this.websocketPool[roomId] = instance;
    const { socketIo } = instance;
    if (!socketIo) {
      return instance;
    }
    // // 監聽連接成功事件
    // socketIo.on("connect", () => {
    //   console.log("Connected to server");
    // });

    // // 監聽來自服務器的消息
    // socketIo.on("message", (data) => {
    //   console.log("Received message:", data);
    // });

    // // 監聽自定義事件
    // socketIo.on("customEvent", (data) => {
    //   console.log("Received custom event with data:", data);
    // });

    // // 監聽斷線連接事件
    // socketIo.on("disconnect", (reason) => {
    //   console.log("Disconnected from server due to:", reason);
    // });
    return instance;
  }

  getInstance(roomId: string) {
    return this.websocketPool[roomId];
  }

  // 傳送websocket消息
  // sendMessage = ({roomId, msgType, data }: { roomId:string, msgType: WsMsgTypeEnum; data?: any }) => {
  //   console.log("【websocket】傳送websocket消息", msgType, data);
  //   const socket = this.websocketPool[roomId]
  //   const socketIo = socket?.socketIo;
  //   socketIo?.emit(msgType, {
  //     roomId: roomId,
  //     socketId: socketIo.id,
  //     data,
  //     isAdmin: socket.isAdmin,
  //   });
  // };

  // close = (roomId: string) => {
  //   const socket = this.websocketPool[roomId]
  //   const socketIo = socket?.socketIo;
  //   console.warn("手動關閉websocket連接", socketIo?.id);
  //   socketIo?.close();
  // };
}

export const webSocketService = new WebsocketService();
