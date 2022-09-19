import NIM from "@yxim/nim-web-sdk";
import Eventemitter from "eventemitter3";
import logger from "./utils/logger";

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
  getChatroomMembers(options: {
    guest: boolean;
    limit: number;
    done: (error: any, obj: any) => void;
  }) {
    this.chatroom.getChatroomMembers(options);
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
