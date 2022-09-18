import IMSDK from "../src/index";

const chatroom = IMSDK.Chatroom.getInstance({
  appKey: "", // appkey
  account: "", // 账号
  token: "", // 凭证
  chatroomId: "", // 聊天室
  chatroomAddresses: [], // 聊天室地址
  chatroomNick: "", // 昵称
  chatroomAvatar: "", // 头像
});

console.log(IMSDK.Chatroom);
console.log(chatroom);
