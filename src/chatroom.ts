import NIM from "@yxim/nim-web-sdk";
import Eventemitter from "eventemitter3";
import logger from "./utils/logger";

// 聊天室
interface NIMRoomchat {
  getHistoryMsgs(arg0: {
    timetag: number;
    limit: number;
    msgTypes: string[];
    done: (error: any, obj: any) => void;
  }): Promise<[any, any]>;
  sendText(arg: {
    text: string;
    done: (error: any, msgObj: Message) => void;
  }): void;
  getChatroomMembers(options: {
    guest: boolean;
    limit: number;
    done: (error: any, obj: any) => void;
  }): unknown;
  getChatroom(arg0: {
    done(error: Error, obj: ChatroomInfo): void;
  }): Promise<ChatroomInfo | Error>;
  destroy(options: { done(error: any): any }): Promise<Error | boolean>;
  connect(): void;
  setOptions(options: Options): void;
  disconnect: () => void;
}

interface Error {
  cmd: string;
  code: number | string;
  message: string;
  reason?: "chatroomClosed" | "managerKick" | "samePlatformKick";
  retryCount?: number;
  willReconnect: boolean;
}

interface Options {
  appKey: string; // 在云信管理后台查看应用的 appKey
  chatroomId: string; // 聊天室 ID
  chatroomAddresses: string[]; // 聊天室地址
  chatroomNick: string; // 聊天室昵称
  chatroomAvatar: string; // 聊天室头像
  account: string; // 帐号, 应用内唯一
  token: string; // 帐号的 token, 用于建立连接
  nosScene?: string; // nos存储场景 默认 chatroom
  chatroomCustom?: object; // 扩展字段, 设置了之后, 通过获取聊天室成员列表获取的聊天室成员信息会包含此字段
  chatroomEnterCustom?: object; // 扩展字段, 如果填了, 聊天室成员收到的聊天室通知消息的 attach.custom 的值为此字段
  onconnect?: (obj: ConnectResult) => void;
  onerror?: (error: any) => void;
  onwillreconnect?: (obj: { duration: number; retryCount: number }) => void;
  ondisconnect?: (obj: any) => void;
  onmsgs?: (msgs: Message[]) => void;
}
interface ChatroomInfo {
  id: string; // 聊天室 id
  name: string; // 聊天室名字
  announcement: string; // 聊天室公告
  broadcastUrl: string; // 直播地址
  custom: object; //第三方扩展字段 推荐使用JSON格式构建, 非JSON格式的话, Web端会正常接收, 但是会被其它端丢弃
  createTime: number; // 创建时间
  updateTime: number; // 更新时间
  creator: number; // 创建者账号
  onlineMemberNum: number; //当前在线人数
  mute: boolean; //是否禁言, 禁言状态下普通成员不能发送消息, 创建者和管理员可以发送消息
  queuelevel: number; // 队列管理权限：0:所有人都有权限变更队列，1:只有主播管理员才能操作变更
}

interface Member {
  chatroomId: string;
  account: string; // 账号
  nick: string; // 昵称
  avatar: string; // 头像
  type: keyof typeof MemberType; // 类型
  blacked: boolean; // 是否被拉黑
  gaged: boolean; // 是否被禁言
  level: number; // 级别
  online: boolean; // 是否在线，只有固定成员才能离线, 对游客而言只能是在线
  enterTime: number; // 进入聊天室的时间, 如果离线, 无该字段
  custom: object; // 扩展字段
  updateTime: number; // 更新时间
  tempMuted: boolean; // 是否被临时禁言
  tempMuteDuration: number; // 临时禁言剩余时长
}
interface ConnectResult {
  chatroom: ChatroomInfo;
  member: Member;
}

// 聊天室消息对象
interface Message {
  chatroomId: string; // 聊天室
  idClient: number; // 消息id
  from: number; // 消息发送方, 帐号
  fromNick: string; // 消息发送方的昵称
  fromAvatar: string; // 消息发送方的头像
  fromCustom: object; // 消息发送方的扩展字段
  fromClientType: keyof typeof DeviceType;
  type: keyof typeof ChatroomMessageType;
  flow: keyof typeof MessageFlow;
  resend: boolean; //  是否是重发的消息
  time: number; // 发送时间

  text?: string; // 文本消息的文本内容
  file?: object; //文件消息的文件对象
  geo?: object; // 地理位置消息的地理位置对象
  tip?: object; // 提醒消息的内容
  content?: object; // 自定义消息的消息内容
  attach: {
    type: any;
  }; // 聊天室通知消息的附加信息
  custom: object; // 附加信息
}

export enum MemberType {
  owner = "owner", // 房主
  manager = "manager", // 管理员
  restricted = "restricted", // 受限制(被拉黑或禁言)
  common = "common", // 普通成员
  guest = "guest", // 游客
}

// 消息流向
export enum MessageFlow {
  in = "in",
  out = "out",
}

// 设备类型
export enum DeviceType {
  Android = "Android",
  iOS = "iOS",
  PC = "PC",
  Web = "Web",
  Mac = "Mac",
}

// 枚举消息格式类型
export enum ChatroomMessageType {
  text = "text", // 文本
  image = "image", // 图片
  audio = "audio", // 音频
  video = "video", // 视频
  file = "file", // 文件
  geo = "geo", // 地理位置
  custom = "custom", // 自定义消息
  tip = "tip", // 提醒消息
  notification = "notification", // 聊天室通知消息
}

// 聊天室通知消息类型
export enum ChatroomNotifiyType {
  memberEnter = "memberEnter", // 当有人进入聊天室时
  memberExit = "memberExit", // 当有人退出聊天室时
  addManager = "addManager", // 有人被加为管理员时
  removeManager = "removeManager", // 有人被移除管理员时
  addCommon = "addCommon", // 有人被加为普通成员时
  removeCommon = "removeCommon", // 当有人被移除普通成员时
  blackMember = "blackMember", // 当有人被加入黑名单时
  unblackMember = "unblackMember", // 当有人被移除黑名单时
  gagMember = "gagMember", // 当有人被加入禁言名单时
  ungagMember = "ungagMember", // 当有人被移除禁言名单时
  kickMember = "kickMember", // 当有人被踢出房间
  updateChatroom = "updateChatroom", // 当聊天室信息更新
  updateMemberInfo = "updateMemberInfo", // 当更新自己在聊天室信息时
  addTempMute = "addTempMute", // 当有人被临时禁言解除
  removeTempMute = "removeTempMute", // 当有人被临时禁言
  muteRoom = "muteRoom", // 聊天室被禁言
  unmuteRoom = "unmuteRoom", // 聊天室解除禁言
}

class Chatroom extends Eventemitter {
  private chatroom: NIMRoomchat;
  static instance: Chatroom;
  static EVENTS = ChatroomNotifiyType;
  constructor(options: Options) {
    super();
    this.chatroom = NIM.Chatroom.getInstance({
      ondisconnect(error: Error) {
        if (error) {
          switch (error.code) {
            case 302:
              logger.error(error.message);
              break;
            case "kicked":
              logger.error("已被踢");
              break;
            default:
              break;
          }
        }
      },
      ...options,
      onmsgs: (msgs: Message[]) => {
        msgs.forEach((msg: Message) => {
          const type = msg.type;
          if (
            type === ChatroomMessageType.text ||
            type === ChatroomMessageType.image ||
            type === ChatroomMessageType.audio ||
            type === ChatroomMessageType.video ||
            type === ChatroomMessageType.file ||
            type === ChatroomMessageType.geo ||
            type === ChatroomMessageType.tip
          ) {
            console.log("======");
          } else if (type === ChatroomMessageType.notification) {
            const attach = msg.attach;
            this.emit(attach.type, msg);
          } else if (type === ChatroomMessageType.custom) {
          } else {
            logger.info("未知消息");
          }
        });
      },
    });
  }

  //获取实例
  static getInstance(options: Options) {
    if (Chatroom.instance === undefined) {
      Chatroom.instance = new Chatroom({
        ...options,
      });
    }
    return Chatroom.instance;
  }

  // 更新
  setOptions(options: Options) {
    this.chatroom.setOptions(options);
  }

  // 获取聊天室信息
  getChatroom(): Promise<ChatroomInfo | any> {
    return new Promise((resolve, reject) => {
      this.chatroom.getChatroom({
        done(error: Error, obj: ChatroomInfo) {
          if (error) {
            reject(error);
          } else {
            resolve(obj);
          }
        },
      });
    });
  }

  //  获取聊天室成员列表
  getChatroomMembers(
    options: {
      guest: boolean;
      limit: number;
      done: (error: any, obj: any) => void;
    } = { guest: false, limit: 100, done: () => {} }
  ) {
    this.chatroom.getChatroomMembers(options);
  }

  // 发送文本消息
  sendText(text: string) {
    this.chatroom.sendText({
      text: text,
      done: function sendChatroomMsgDone(error, msgObj: Message) {
        console.log(msgObj);
      },
    });
  }

  // 获取历史消息列表
  getHistoryMsgs(
    { timetag, limit, msgTypes } = {
      timetag: Date.now(),
      limit: 10,
      msgTypes: [],
    }
  ) {
    return new Promise<[any, any]>((resolve) => {
      this.chatroom.getHistoryMsgs({
        timetag,
        limit,
        msgTypes,
        done(error: any, obj: any) {
          resolve([error, obj]);
        },
      });
    });
  }

  // 获取全部历史记录
  async getAllHistoryMsgs(
    { timetag, limit, msgTypes } = {
      timetag: Date.now(),
      limit: 10,
      msgTypes: [],
    }
  ): Promise<Message[]> {
    let result: Message[] = [];
    const [error, obj] = await this.getHistoryMsgs({
      timetag,
      limit,
      msgTypes,
    });
    if (error === null) {
      const msgs = obj.msgs;
      if (msgs.length >= limit) {
        const arr = await this.getAllHistoryMsgs({
          timetag: msgs[msgs.length - 1].time,
          limit,
          msgTypes: [],
        });
        result = [...msgs, ...arr];
      } else {
        result = [...msgs];
      }
    }
    return result;
  }

  // 重新连接
  connect(): void {
    this.chatroom.connect();
  }

  // 断开连接
  disconnect(): void {
    this.chatroom.disconnect();
  }

  // 清除聊天室
  destroy(): Promise<[Error | null]> {
    return new Promise((resolve, reject) => {
      this.chatroom.destroy({
        done(error: Error) {
          if (error) {
            resolve([error]);
          } else {
            resolve([null]);
          }
        },
      });
    });
  }
}

export default Chatroom;
