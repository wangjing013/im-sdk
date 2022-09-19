import Eventemitter from "eventemitter3";
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
    getChatroomMembers(options: {
        guest: boolean;
        limit: number;
        done: (error: any, obj: any) => void;
    }): void;
    connect(): void;
    disconnect(): void;
    destroy(): Promise<Error | boolean>;
}
export default Chatroom;
