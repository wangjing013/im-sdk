import IMSDk from "../src/index";

const chatroom = IMSDk.Chatroom.getInstance({
  appKey: "", // appkey
  account: "", // 账号
  token: "", // 凭证
  chatroomId: "", // 聊天室
  chatroomAddresses: [], // 聊天室地址
  chatroomNick: "", // 昵称
  chatroomAvatar: "", // 头像
});

console.log(IMSDk.Chatroom);
console.log(chatroom);
