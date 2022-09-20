import Eventemitter from "eventemitter3";
interface Error {
    cmd: string;
    code: number | string;
    message: string;
    reason?: "chatroomClosed" | "managerKick" | "samePlatformKick";
    retryCount?: number;
    willReconnect: boolean;
}
interface Options {
    appKey: string;
    chatroomId: string;
    chatroomAddresses: string[];
    chatroomNick: string;
    chatroomAvatar: string;
    account: string;
    token: string;
    nosScene?: string;
    chatroomCustom?: object;
    chatroomEnterCustom?: object;
    onconnect?: (obj: ConnectResult) => void;
    onerror?: (error: any) => void;
    onwillreconnect?: (obj: {
        duration: number;
        retryCount: number;
    }) => void;
    ondisconnect?: (obj: any) => void;
    onmsgs?: (msgs: Message[]) => void;
}
interface ChatroomInfo {
    id: string;
    name: string;
    announcement: string;
    broadcastUrl: string;
    custom: object;
    createTime: number;
    updateTime: number;
    creator: number;
    onlineMemberNum: number;
    mute: boolean;
    queuelevel: number;
}
interface Member {
    chatroomId: string;
    account: string;
    nick: string;
    avatar: string;
    type: keyof typeof MemberType;
    blacked: boolean;
    gaged: boolean;
    level: number;
    online: boolean;
    enterTime: number;
    custom: object;
    updateTime: number;
    tempMuted: boolean;
    tempMuteDuration: number;
}
interface ConnectResult {
    chatroom: ChatroomInfo;
    member: Member;
}
interface Message {
    chatroomId: string;
    idClient: number;
    from: number;
    fromNick: string;
    fromAvatar: string;
    fromCustom: object;
    fromClientType: keyof typeof DeviceType;
    type: keyof typeof ChatroomMessageType;
    flow: keyof typeof MessageFlow;
    resend: boolean;
    time: number;
    text?: string;
    file?: object;
    geo?: object;
    tip?: object;
    content?: object;
    attach: {
        type: any;
    };
    custom: object;
}
export declare enum MemberType {
    owner = "owner",
    manager = "manager",
    restricted = "restricted",
    common = "common",
    guest = "guest"
}
export declare enum MessageFlow {
    in = "in",
    out = "out"
}
export declare enum DeviceType {
    Android = "Android",
    iOS = "iOS",
    PC = "PC",
    Web = "Web",
    Mac = "Mac"
}
export declare enum ChatroomMessageType {
    text = "text",
    image = "image",
    audio = "audio",
    video = "video",
    file = "file",
    geo = "geo",
    custom = "custom",
    tip = "tip",
    notification = "notification"
}
export declare enum ChatroomNotifiyType {
    memberEnter = "memberEnter",
    memberExit = "memberExit",
    addManager = "addManager",
    removeManager = "removeManager",
    addCommon = "addCommon",
    removeCommon = "removeCommon",
    blackMember = "blackMember",
    unblackMember = "unblackMember",
    gagMember = "gagMember",
    ungagMember = "ungagMember",
    kickMember = "kickMember",
    updateChatroom = "updateChatroom",
    updateMemberInfo = "updateMemberInfo",
    addTempMute = "addTempMute",
    removeTempMute = "removeTempMute",
    muteRoom = "muteRoom",
    unmuteRoom = "unmuteRoom"
}
declare class Chatroom extends Eventemitter {
    private chatroom;
    static instance: Chatroom;
    static EVENTS: typeof ChatroomNotifiyType;
    constructor(options: Options);
    static getInstance(options: Options): Chatroom;
    setOptions(options: Options): void;
    getChatroom(): Promise<ChatroomInfo | any>;
    getChatroomMembers(options?: {
        guest: boolean;
        limit: number;
        done: (error: any, obj: any) => void;
    }): void;
    sendText(text: string): void;
    getHistoryMsgs({ timetag, limit, msgTypes }?: {
        timetag: number;
        limit: number;
        msgTypes: never[];
    }): Promise<[any, any]>;
    getAllHistoryMsgs({ timetag, limit, msgTypes }?: {
        timetag: number;
        limit: number;
        msgTypes: never[];
    }): Promise<Message[]>;
    connect(): void;
    disconnect(): void;
    destroy(): Promise<[Error | null]>;
}
export default Chatroom;
