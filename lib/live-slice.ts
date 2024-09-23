import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { WsConnectStatusEnum } from "@/network/webSocket";

export type WebsocketProperties =
  | {
      status: WsConnectStatusEnum;
      url: string;
      roomId: string;
      isAdmin: boolean;
    }
  | undefined;

export type WebrtcProperties = {
  roomId: string;
  candidateFlag: boolean;
  getStatsSetIntervalDelay: number;
  forceINums: number; // 傳送forceI次數
  forceINumsMax: number; // 最多傳送幾次forceI
  preFramesDecoded: number; // 上一幀
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
  rtcStatus: {
    joined: boolean; // true代表成功，false代表失敗
    icecandidate: boolean; // true代表成功，false代表失敗
    createOffer: boolean; // true代表成功，false代表失拜
    setLocalDescription: boolean; // true代表成功，false代表失敗
    answer: boolean; // true代表成功，false代表失敗
    setRemoteDescription: boolean; // true代表成功，false代表失敗
    addStream: boolean; // true代表成功，false代表失敗
    loadstart: boolean; // true代表成功，false代表失敗
    loadedmetadata: boolean; // true代表成功，false代表失敗
  };
};

const initialState: {
  wsMap: { [key: string]: WebsocketProperties };
  wrcMap: { [key: string]: WebrtcProperties };
} = {
  wsMap: {},
  wrcMap: {},
};

const liveSlice = createSlice({
  name: "live",
  initialState,
  reducers: {
    updateWsMap: (
      state,
      action: PayloadAction<{ roomId: string; arg: WebsocketProperties }>
    ) => {
      const { wsMap } = state;
      const { roomId, arg } = action.payload;
      const val = wsMap?.[roomId];
      if (val) {
        wsMap[roomId] = { ...val, ...arg };
      } else {
        wsMap && (wsMap[roomId] = arg);
      }
    },
    updateWrcMap: (
      state,
      action: PayloadAction<{ roomId: string; arg: WebrtcProperties }>
    ) => {
      const { wrcMap } = state;
      const { roomId, arg } = action.payload;
      const val = wrcMap?.[roomId];
      if (val) {
        wrcMap[roomId] = { ...val, ...arg };
      } else {
        wrcMap && (wrcMap[roomId] = { ...arg });
      }
    },
  },
});

export const { updateWsMap, updateWrcMap } = liveSlice.actions;

export default liveSlice.reducer;
