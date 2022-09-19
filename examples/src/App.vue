<template>
  <div>1231313</div>
</template>

<script>
import { onMounted } from "vue";
import IMSDk from "../../src/index";
export default {
  setup() {
    onMounted(() => {
      const chatroom = IMSDk.Chatroom.getInstance({
        appKey: "678ddcd03a3225cd7932d2ecef09d246", // appkey
        account: "1", // 账号
        token: "6ad10018fb443cf3851510f812d9bba2", // 凭证
        chatroomId: "2302150639", // 聊天室
        chatroomAddresses: [
          "chatweblink12.netease.im:443",
          "chatweblink11.netease.im:443",
        ], // 聊天室地址
        chatroomNick: "", // 昵称
        chatroomAvatar: "", // 头像
        onconnect(obj) {
          console.log("聊天室:", obj.chatroom);
          console.log("登录账号:", obj.member);
        },
      });
    });
  },
};
</script>
