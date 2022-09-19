// 聊天室
interface NIMRoomchat {
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
