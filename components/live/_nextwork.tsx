import { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { FromUserObject, WebRTCObject, WebsocketObject } from '@/interfaces';
import { WebRTCClass } from '@/network/webRtc';
import { WebSocketClass } from '@/network/webSocket';

type NetworkState = {
  wsMap: WebsocketObject;
  rtcMap: WebRTCObject;
  fromUserMap: FromUserObject;
};

type NetworkAction =
  | { type: 'updateWsMap'; payload: { roomId: string; arg: WebSocketClass } }
  | { type: 'updateRtcMap'; payload: { roomId: string; arg: WebRTCClass } }
  | { type: 'updateFromUserMap'; payload: { socketId: string; arg: string } };

const initialState: NetworkState = {
  wsMap: {},
  rtcMap: {},
  fromUserMap: {},
};

const NetworkStateContext = createContext<NetworkState | undefined>(undefined);
const NetworkDispatchContext = createContext<Dispatch<NetworkAction> | undefined>(undefined);

const reducer = (state: NetworkState, action: NetworkAction): NetworkState => {
  switch (action.type) {
    case 'updateWsMap': {
      const { roomId, arg } = action.payload;
      const updatedWsMap = {
        ...state.wsMap,
        [roomId]: { ...state.wsMap[roomId], ...arg },
      };
      return { ...state, wsMap: updatedWsMap };
    }
    case 'updateRtcMap': {
      const { roomId, arg } = action.payload;
      const updatedRtcMap = {
        ...state.rtcMap,
        [roomId]: { ...state.rtcMap[roomId], ...arg },
      };
      return { ...state, rtcMap: updatedRtcMap };
    }
    case 'updateFromUserMap': {
      const { socketId, arg } = action.payload;
      const updatedFromUserMap = {
        ...state.fromUserMap,
        [socketId]: arg,
      };
      return { ...state, fromUserMap: updatedFromUserMap };
    }
    default:
      return state;
  }
};

type NetworkProviderProps = {
  children: ReactNode;
  initialValue?: NetworkState;
};

export const NetworkProvider = ({
  children,
  initialValue = initialState,
}: NetworkProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  return (
    <NetworkDispatchContext.Provider value={dispatch}>
      <NetworkStateContext.Provider value={state}>
        {children}
      </NetworkStateContext.Provider>
    </NetworkDispatchContext.Provider>
  );
};
export const useDispatchNetwork = () => {
  const context = useContext(NetworkDispatchContext);
  if (context === undefined) {
    throw new Error('useDispatchNetwork must be used within a NetworkProvider');
  }
  return context;
};
