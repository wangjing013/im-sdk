import NIM from "@yxim/nim-web-sdk";
import Eventemitter from "eventemitter3";
import logger from "./utils/logger";

// 实例化选项
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
  onconnect?: () => void;
  onerror?: () => void;
  onwillreconnect?: (obj: { duration: number; retryCount: number }) => void;
  ondisconnect?: () => void;
  onmsgs?: (msgs: Message[]) => void;
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
  text: string; // 文本消息的文本内容
  file: object; //文件消息的文件对象
  geo: object; // 地理位置消息的地理位置对象
  tip: object; // 提醒消息的内容
  content: object; // 自定义消息的消息内容
  attach: {
    type: any;
  }; // 聊天室通知消息的附加信息
  custom: object; // 附加信息
  resend: boolean; //  是否是重发的消息
  time: number;
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

// 聊天室
interface NIMRoomchat {
  getChatroom(arg0: {
    done(error: Error, obj: ChatroomInfo): void;
  }): Promise<ChatroomInfo | Error>;
  destroy(options: { done(error: any): any }): Promise<Error | boolean>;
  connect(): void;
  setOptions(options: Options): void;
  disconnect: () => void;
}
interface Error {
  code: number | string;
  reason?: "chatroomClosed" | "managerKick" | "samePlatformKick";
  message?: string;
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
}

class Chatroom extends Eventemitter {
  chatroom: NIMRoomchat;
  static instance: Chatroom;
  static EVENTS = ChatroomNotifiyType;
  //构建函数

  constructor(options: Options) {
    super();
    this.chatroom = NIM.Chatroom.getInstance({
      ...options,
      onconnect() {},
      onwillreconnect() {},
      ondisconnect() {},
      onerror() {},
      onmsgs(msgs: Message[]) {
        msgs.forEach((msg: Message) => {
          const type = msg.type;
          if (type === ChatroomMessageType.text) {
          } else if (type === ChatroomMessageType.image) {
          } else if (type === ChatroomMessageType.audio) {
          } else if (type === ChatroomMessageType.video) {
          } else if (type === ChatroomMessageType.file) {
          } else if (type === ChatroomMessageType.geo) {
          } else if (type === ChatroomMessageType.tip) {
          } else if (type === ChatroomMessageType.notification) {
            const attach = msg.attach;
            switch (attach.type) {
              case ChatroomNotifiyType.memberEnter: // 成员进入
                break;
              case ChatroomNotifiyType.memberExit: // 成员退出
                break;
              case ChatroomNotifiyType.blackMember: // 加入黑名单
                break;
              case ChatroomNotifiyType.unblackMember: // 从黑名单移除
                break;
              case ChatroomNotifiyType.gagMember: // 禁言
                break;
              case ChatroomNotifiyType.ungagMember: // 解除禁言
                break;
              case ChatroomNotifiyType.muteRoom: // 聊天室禁言
                break;
              case ChatroomNotifiyType.unmuteRoom: // 解除禁言
                break;
              case ChatroomNotifiyType.updateChatroom: // 聊天室信息更新
                break;
              default:
                break;
            }
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

  // 重新连接
  connect(): void {
    Chatroom.instance.connect();
  }

  // 断开连接
  disconnect(): void {
    Chatroom.instance.disconnect();
  }

  // 清除聊天室
  destroy(): Promise<Error | boolean> {
    return new Promise((resolve, reject) => {
      this.chatroom.destroy({
        done(error: Error) {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        },
      });
    });
  }
}

export default Chatroom;