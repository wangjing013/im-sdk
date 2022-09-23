import NIM from "@yxim/nim-web-sdk";
import Eventemitter from "eventemitter3";
import logger from "./utils/logger";

// 聊天室
interface NIMRoomchat {
  getChatroomMembersInfo(arg: { accounts: string[]; done(error: Error | null, obj: any): void; }): void;
  kickChatroomMember(arg: {
    account: string;
    done(error: any, obj: any): void;
  }): void;
  updateChatroomMemberTempMute(arg: {
    account: string;
    duration: number;
    needNotify: boolean;
    custom: string;
    done(error: any, obj: any): void;
  }): void;
  markChatroomGaglist(arg: {
    account: string;
    isAdd?: boolean;
    done: (error: any, obj: any) => void;
  }): Promise<[any, any]>;
  updateChatroom(
    arg: ChatroomUpdateInfo & {
      done(error: any, obj: any): void;
    }
  ): Promise<[Error | null, ChatroomInfo]>;
  getHistoryMsgs(
    arg: HistoryParamsType & {
      done: (error: any, obj: any) => void;
    }
  ): Promise<[any, any]>;
  getChatroomMembers(
    options: MemberParamsType & {
      done?: (error: Error | null, obj: any) => void;
    }
  ): Promise<Member[]>;
  getChatroom(arg: {
    done(error: Error, obj: ChatroomInfo): void;
  }): Promise<ChatroomInfo | Error>;
  destroy(options: { done(error: any): any }): Promise<Error | boolean>;
  connect(): void;
  setOptions(options: Options): void;
  disconnect: () => void;
  sendText(arg: {
    text: string;
    done: (error: any, msgObj: Message) => void;
  }): void;
  sendFile(arg: UploadFileParams): void;
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
  account: string; // 帐号, 应用内唯一
  token: string; // 帐号的 token, 用于建立连接
  chatroomNick: string; // 聊天室昵称
  chatroomAvatar: string; // 聊天室头像
  nosScene?: string; // nos存储场景 默认 chatroom
  chatroomCustom?: string; // 扩展字段, 设置了之后, 通过获取聊天室成员列表获取的聊天室成员信息会包含此字段
  chatroomEnterCustom?: string; // 扩展字段, 如果填了, 聊天室成员收到的聊天室通知消息的 attach.custom 的值为此字段
  onconnect?: (obj: ConnectResult) => void;
  onerror?: (error: any) => void;
  onwillreconnect?: (obj: { duration: number; retryCount: number }) => void;
  ondisconnect?: (obj: any) => void;
  onmsgs?: (msgs: Message[]) => void;
}

// 聊天室信息
interface ChatroomInfo {
  id: string; // 聊天室 id
  name?: string; // 聊天室名字
  announcement?: string; // 聊天室公告
  broadcastUrl?: string; // 直播地址
  custom?: any; //第三方扩展字段 推荐使用JSON格式构建, 非JSON格式的话, Web端会正常接收, 但是会被其它端丢弃
  createTime: number; // 创建时间
  updateTime: number; // 更新时间
  creator: number; // 创建者账号
  onlineMemberNum: number; //当前在线人数
  mute: boolean; //是否禁言, 禁言状态下普通成员不能发送消息, 创建者和管理员可以发送消息
  queuelevel?: number; // 队列管理权限：0:所有人都有权限变更队列，1:只有主播管理员才能操作变更
}

// 更新聊天室信息
interface ChatroomUpdateInfo {
  chatroom: Pick<
    ChatroomInfo,
    "name" | "announcement" | "broadcastUrl" | "custom" | "queuelevel"
  >;
  needNotify: boolean; // 是否需要下发对应的通知消息
  custom?: any; // 对应的通知消息的扩展字段
  needSave?: boolean; // 可选,默认false,是否支持nick,avator和custom字段的持久化（固定成员有效）
}

// 成员列表
export interface Member {
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
  custom: any; // 扩展字段
  updateTime: number; // 更新时间
  tempMuted: boolean; // 是否被临时禁言
  tempMuteDuration: number; // 临时禁言剩余时长
}

interface ConnectResult {
  chatroom: ChatroomInfo;
  member: Member;
}

// 聊天室消息对象
export interface Message {
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

// 查看历史消息入参类型
interface HistoryParamsType {
  timetag?: number;
  limit?: number;
  reverse?: boolean;
  msgTypes?: string[];
}

// 查看成员的入参
interface MemberParamsType {
  guest?: boolean;
  limit?: number;
  time?: number;
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
  tip = "tip", // 提醒消息
  notification = "notification", // 聊天室通知消息
  custom = "custom", // 自定义消息
}

// 上传文件类型
type UploadFileType = "image" | "audio" | "video" | "file";
// 文件输入类型
type FileInput = Blob | Element | string; // string base64
// 上传进度
type Progress = {
  total: number;
  loaded: number;
  percentage: number;
  percentageText: string;
};

// 上传文件参数
interface UploadFileParams {
  type?: UploadFileType;
  fileInput: FileInput;
  uploadprogress: (obj: Progress) => void;
  uploaddone: (error: Error | null, file: File) => void;
  beforesend: (msg: Message) => void;
  done: (error: Error | null, msg: Message) => void;
}

//

// 聊天室通知类型消息
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

// 自定义事件
export enum CustomEventType {
  normal = "normal",
  loginSuccess = "loginSuccess",
  loginFail = "loginFail"
}

// 错误原因
export const ErrorReason = {
  302: "账号或者密码错误",
  chatroomClosed: "聊天室关闭了",
  managerKick: "被管理员踢出",
  samePlatformKick: "不允许同一个帐号重复登录同一个聊天室"
};

console.log();

class Chatroom extends Eventemitter {
  static instance: Chatroom;
  static EVENTS = {
    ...ChatroomNotifiyType,
    ...ChatroomMessageType,
    ...CustomEventType,
  };
  chatroom: NIMRoomchat;
  constructor(options: Options) {
    super();
    this.chatroom = NIM.Chatroom.getInstance({
      ...options,
      onconnect: (obj: ConnectResult) => {
        this.emit(CustomEventType.loginSuccess, obj);
      },
      onwillreconnect(obj: { duration: number; retryCount: number }) { },
      ondisconnect: (error: Error) => {
        if (error.code === 302) {
          this.emit(CustomEventType.loginFail, error);
        } else if (error.code === "kicked") {
          logger.error(ErrorReason[error.reason!]);
        }
      },
      onerror(error: Error) {
        logger.error(`状态:${error.code} 错误原因:${error.message}`);
      },
      onmsgs: (msgs: Message[]) => {
        msgs.forEach((msg: Message) => {
          const type = msg.type;
          if (
            type === ChatroomMessageType.text ||
            type === ChatroomMessageType.image ||
            type === ChatroomMessageType.audio ||
            type === ChatroomMessageType.video ||
            type === ChatroomMessageType.file ||
            type === ChatroomMessageType.geo
          ) {
            this.emit(CustomEventType.normal, msg);
          } else if (type === ChatroomMessageType.tip) {
            this.emit(ChatroomMessageType.tip, msg);
          } else if (type === ChatroomMessageType.notification) {
            const attach = msg.attach;
            this.emit(attach.type, msg);
          } else if (type === ChatroomMessageType.custom) {
            // todo 分发自定义消息
            this.emit(ChatroomMessageType.custom, msg);
          } else {
            logger.info("未知消息");
          }
        });
      },
    });
  }

  //获取实例
  static getInstance(options: Options) {
    if (!Chatroom.instance) {
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
  getChatroom() {
    return new Promise<[Error | null, ChatroomInfo]>((resolve) => {
      this.chatroom.getChatroom({
        done(error: Error | null, obj: ChatroomInfo) {
          resolve([error, obj]);
        },
      });
    });
  }
  // 更新聊天室信息
  updateChatroom(options: ChatroomUpdateInfo) {
    return new Promise<[Error | null, any]>((resolve) => {
      this.chatroom.updateChatroom({
        ...options,
        done(error: Error | null, obj: any) {
          resolve([error, obj]);
        },
      });
    });
  }

  // 获取所有成员列表
  async getAllChatroomMembers({
    guest = false,
    limit = 100,
    time = 0,
  }: MemberParamsType = {}): Promise<Member[]> {
    let result: Member[] = [];
    const [error, obj] = await this.getChatroomMembers({
      guest,
      limit,
      time,
    });
    if (error === null) {
      const members = obj.members;
      if (members.length >= obj.limit) {
        const arr = await this.getAllChatroomMembers({
          guest,
          limit: obj.limit,
          time: members[members.length - 1].updateTime,
        });
        result = [...members, ...arr];
      } else {
        result = [...members];
      }
    }
    return result;
  }

  //  获取聊天室成员列表
  getChatroomMembers({
    guest = false,
    limit = 100,
    time = 0,
  }: MemberParamsType = {}) {
    return new Promise<[Error | null, any]>((resolve) => {
      this.chatroom.getChatroomMembers({
        guest,
        limit,
        time,
        done(error, obj) {
          resolve([error, obj]);
        },
      });
    });
  }

  // 获取历史消息列表
  getHistoryMsgs({
    timetag = Date.now(),
    limit = 100,
    reverse = false,
    msgTypes = [],
  }: HistoryParamsType = {}) {
    return new Promise<[Error | null, any]>((resolve) => {
      this.chatroom.getHistoryMsgs({
        timetag,
        limit,
        reverse,
        msgTypes,
        done(error: Error | null, obj: any) {
          resolve([error, obj]);
        },
      });
    });
  }

  // 获取全部历史记录
  async getAllHistoryMsgs({
    timetag,
    limit,
    msgTypes,
  }: HistoryParamsType = {}): Promise<Message[]> {
    let result: Message[] = [];
    const [error, obj] = await this.getHistoryMsgs({
      timetag,
      limit,
      msgTypes,
    });
    if (error === null) {
      const msgs = obj.msgs;
      if (msgs.length >= obj.limit) {
        const arr = await this.getAllHistoryMsgs({
          limit,
          msgTypes,
          timetag: msgs[msgs.length - 1].time,
        });
        result = [...msgs, ...arr];
      } else {
        result = [...msgs];
      }
    }
    return result;
  }

  // 发送文本消息
  sendText(text: string): Promise<[error: Error, msgObj: Message]> {
    return new Promise((resolve) => {
      this.chatroom.sendText({
        text: text,
        done(error, msgObj: Message) {
          resolve([error, msgObj]);
        },
      });
    });
  }

  // 发送文件
  sendFile({
    type = "file",
    fileInput,
    uploadprogress,
    uploaddone,
    beforesend,
    done,
  }: UploadFileParams) {
    this.chatroom.sendFile({
      type,
      fileInput,
      uploadprogress,
      uploaddone,
      beforesend,
      done,
    });
  }

  // 聊天室添加禁言、解除禁言
  markChatroomGaglist({
    account,
    isAdd = true,
  }: {
    account: string;
    isAdd: boolean;
  }) {
    return new Promise<
      [Error | null, { account: string; isAdd: boolean; custom: string }]
    >((resolve) => {
      this.chatroom.markChatroomGaglist({
        account,
        isAdd,
        done: (
          error: Error | null,
          obj: { account: string; isAdd: boolean; custom: string }
        ) => {
          resolve([error, obj]);
        },
      });
    });
  }

  // 聊天室临时禁言、解除禁言
  updateChatroomMemberTempMute({
    account,
    duration,
    needNotify = false,
    custom = "",
  }: {
    account: string;
    duration: number;
    needNotify?: boolean;
    custom?: string;
  }) {
    return new Promise<[Error | null, any]>((resolve) => {
      this.chatroom.updateChatroomMemberTempMute({
        account,
        duration,
        needNotify,
        custom,
        done(error: Error | null, obj: any) {
          resolve([error, obj]);
        },
      });
    });
  }

  // 踢出聊天室
  kickChatroomMember({ account }: { account: string }) {
    return new Promise<[Error | null, { account: string; custom: string }]>(
      (resolve) => {
        this.chatroom.kickChatroomMember({
          account,
          done(
            error: Error | null,
            obj: { account: string; custom: string }
          ): void {
            resolve([error, obj]);
          },
        });
      }
    );
  }

  // 获取成员信息
  getChatroomMembersInfo({ accounts }: { accounts: string[] }) {
    return new Promise<[Error | null, any]>(
      (resolve) => {
        this.chatroom.getChatroomMembersInfo({
          accounts,
          done(
            error: Error | null,
            obj: any
          ): void {
            resolve([error, obj]);
          },
        });
      }
    );
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
          resolve([error]);
        },
      });
    });
  }
}

export default Chatroom;
