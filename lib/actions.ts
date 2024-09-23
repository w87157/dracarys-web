import { AnyAction, ThunkAction, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { webSocketService } from "./websocket-manager";
import { TWebSocketOptions } from "@/interfaces";
import { updateWrcMap, updateWsMap } from "./live-slice";
import { webRtcService } from "./webrtc-manager";

// 增加一個泛型参數T以表示参數類型
type AppThunk<T = void> = ThunkAction<T, RootState, unknown, AnyAction>;
type TWebRtcOptions = {
  roomId: string;
  dispatch: Dispatch<AnyAction>;
};
// 修改initializeWebSocketConnection以接受一個参數
export const initializeWebSocketConnection =
  (options: TWebSocketOptions): AppThunk =>
    (dispatch) => {
      // const options :TWebSocketOptions= {roomId, url, isAdmin}
      const instance = webSocketService.connect(options);
      const { status, url, roomId, isAdmin } = instance;
      dispatch(updateWsMap({ roomId, arg: { status, url, roomId, isAdmin } }));
    };

export const initializeWebRtcConnection =
  (options: { roomId: string }): AppThunk =>
    (dispatch) => {
      const fullOptions: TWebRtcOptions = { ...options, dispatch };
      const instance = webRtcService.connect(fullOptions);
      const {
        roomId,
        candidateFlag,
        getStatsSetIntervalDelay,
        forceINums,
        forceINumsMax,
        preFramesDecoded,
        browser,
        rtcStatus,
      } = instance;
      dispatch(
        updateWrcMap({
          roomId,
          arg: {
            roomId,
            candidateFlag,
            getStatsSetIntervalDelay,
            forceINums,
            forceINumsMax,
            preFramesDecoded,
            browser,
            rtcStatus,
          },
        })
      );
    };
