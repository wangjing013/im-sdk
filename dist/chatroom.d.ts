import Eventemitter from "eventemitter3";
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
    onconnect?: () => void;
    onerror?: () => void;
    onwillreconnect?: (obj: {
        duration: number;
        retryCount: number;
    }) => void;
    ondisconnect?: () => void;
    onmsgs?: (msgs: Message[]) => void;
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
    text: string;
    file: object;
    geo: object;
    tip: object;
    content: object;
    attach: {
        type: any;
    };
    custom: object;
    resend: boolean;
    time: number;
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
interface NIMRoomchat {
    getChatroom(arg0: {
        done(error: Error, obj: ChatroomInfo): void;
    }): Promise<ChatroomInfo | Error>;
    destroy(options: {
        done(error: any): any;
    }): Promise<Error | boolean>;
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
}
declare class Chatroom extends Eventemitter {
    chatroom: NIMRoomchat;
    static instance: Chatroom;
    static EVENTS: typeof ChatroomNotifiyType;
    constructor(options: Options);
    static getInstance(options: Options): Chatroom;
    setOptions(options: Options): void;
    getChatroom(): Promise<ChatroomInfo | any>;
    connect(): void;
    disconnect(): void;
    destroy(): Promise<Error | boolean>;
}
export default Chatroom;
