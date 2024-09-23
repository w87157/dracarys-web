import { Dispatch } from "@reduxjs/toolkit";
import { WebRTCClass } from "@/network/webRtc";

class WebRtcService {
  private webRtcPool: {
    [key: string]: WebRTCClass;
  };
  constructor() {
    this.webRtcPool = {};
  }

  connect({ roomId, dispatch }: { roomId: string; dispatch: Dispatch }) {
    const instance = new WebRTCClass({
      roomId: roomId,
      dispatch,
    });
    this.webRtcPool[roomId] = instance;
    return instance;
  }

  getInstance(roomId: string) {
    return this.webRtcPool[roomId];
  }

  getPool() {
    return this.webRtcPool;
  }
}

export const webRtcService = new WebRtcService();
