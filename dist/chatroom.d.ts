import Eventemitter from "eventemitter3";
interface NIMRoomchat {
    updateChatroom(arg: ChatroomUpdateInfo & {
        done(error: any, obj: any): void;
    }): Promise<[Error | null, ChatroomInfo]>;
    getHistoryMsgs(arg: HistoryParamsType & {
        done: (error: any, obj: any) => void;
    }): Promise<[any, any]>;
    getChatroomMembers(options: MemberParamsType & {
        done?: (error: any, obj: any) => void;
    }): Promise<Member[]>;
    getChatroom(arg: {
        done(error: Error, obj: ChatroomInfo): void;
    }): Promise<ChatroomInfo | Error>;
    destroy(options: {
        done(error: any): any;
    }): Promise<Error | boolean>;
    connect(): void;
    setOptions(options: Options): void;
    disconnect: () => void;
    sendText(arg: {
        text: string;
        done: (error: any, msgObj: Message) => void;
    }): void;
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
    appKey: string;
    chatroomId: string;
    chatroomAddresses: string[];
    account: string;
    token: string;
    chatroomNick: string;
    chatroomAvatar: string;
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
    name?: string;
    announcement?: string;
    broadcastUrl?: string;
    custom?: any;
    createTime: number;
    updateTime: number;
    creator: number;
    onlineMemberNum: number;
    mute: boolean;
    queuelevel?: number;
}
interface ChatroomUpdateInfo {
    chatroom: Pick<ChatroomInfo, "name" | "announcement" | "broadcastUrl" | "custom" | "queuelevel">;
    needNotify: boolean;
    custom?: any;
    needSave?: boolean;
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
    custom: any;
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
declare type HistoryParamsType = {
    timetag?: number;
    limit?: number;
    msgTypes?: string[];
};
declare type MemberParamsType = {
    guest?: boolean;
    limit?: number;
    time?: number;
};
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
    static instance: Chatroom;
    static EVENTS: typeof ChatroomNotifiyType;
    chatroom: NIMRoomchat;
    constructor(options: Options);
    static getInstance(options: Options): Chatroom;
    setOptions(options: Options): void;
    getChatroom(): Promise<[Error | null, ChatroomInfo]>;
    updateChatroom(options: ChatroomUpdateInfo): Promise<[Error | null, any]>;
    getAllChatroomMembers({ guest, limit, time, }?: MemberParamsType): Promise<Member[]>;
    getChatroomMembers({ guest, limit, time, }?: MemberParamsType): Promise<[any, any]>;
    getHistoryMsgs({ timetag, limit, msgTypes, }?: HistoryParamsType): Promise<[any, any]>;
    getAllHistoryMsgs({ timetag, limit, msgTypes, }?: HistoryParamsType): Promise<Message[]>;
    sendText(text: string): Promise<[error: Error, msgObj: Message]>;
    connect(): void;
    disconnect(): void;
    destroy(): Promise<[Error | null]>;
}
export default Chatroom;
