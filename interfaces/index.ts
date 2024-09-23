import { Dispatch } from "@reduxjs/toolkit";
import { WebRTCClass } from "@/network/webRtc";
import { WebSocketClass } from "@/network/webSocket";

// 這裡放項目的類型
export enum LiveTypeEnum {
  camera,
  screen,
}

export enum DanmuMsgTypeEnum {
  danmu,
  otherJoin,
  userLeaved,
}

export interface IAdminIn {
  roomId: string;
  socketId: string;
  isAdmin: boolean;
  data: any;
}

export interface IOffer {
  socketId: string;
  roomId: string;
  data: {
    sdp: any;
    target: string;
    sender: string;
    receiver: string;
  };
  isAdmin: boolean;
}

export interface ILiveRoom {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间名字 */
  roomName?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  status?: number;
  avatar?: string;
  desc?: string;
  token?: string;
  user_roles?: number[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ILive {
  id?: number;
  /** 1:系统直播;2:用户直播 */
  system?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;
  socketId?: string;
  user_id?: number;
  roomId?: string;
  track_video?: boolean;
  track_audio?: boolean;
  coverImg?: string;
  data?:string;
  streamurl?: string;
  flvurl?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ICandidate {
  socketId: string;
  roomId: string;
  data: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  };
}

export type TLiveUser = {
  socketId: string;
  avatar: string;
  expr: number;
};

export type TDamu = {
  socketId: string;
  msgType: DanmuMsgTypeEnum;
  msg: string;
};

export type TGift = { name: string; ico: string; price: string };

export type TMediaType = {
  type: LiveTypeEnum;
  txt: string;
};

export interface WebsocketObject {
  [key: string]: WebSocketClass;
}

export interface WebRTCObject {
  [key: string]: WebRTCClass;
}

export interface FromUserObject {
  [key: string]: string;
}

export type NetworkState =
  | {
      wsMap: WebsocketObject;
      rtcMap: WebRTCObject;
      fromUserMap: FromUserObject;
    }
  | undefined;

export type TWebSocketOptions = {
  roomId: string;
  url: string;
  isAdmin: boolean;
  dispatch: Dispatch;
};
