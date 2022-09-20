<template>
  <a-layout>
    <a-layout-content>
      <div>
        <a-button @click="handleUpdate">更新公告信息</a-button>
        <a-button @click="getAllChatroomMembers">获取成员列表</a-button>
      </div>
      <div class="warpper">
        <div class="chatroom">
          <div class="top">聊天室</div>
          <div class="chatroom-main">
            <div class="members"></div>
            <div class="chat-warpper">
              <div class="chat-list">
                <div
                  class="chat-item"
                  v-for="item of history"
                  :key="item.idClient"
                >
                  <a-avatar :src="item.fromAvatar" />
                  <span class="nickname">{{ item.fromNick }}:</span>
                  <span classs="content">{{ item.text }}</span>
                </div>
              </div>
              <div class="chat-footer">
                <div class="chat-message-input-wrap">
                  <a-textarea v-model:value="content" />
                  <a-button type="primary" @click="handleSend">发送</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import Chatroom, { ChatroomNotifiyType } from "../../src/chatroom";

export default {
  name: "AppComponent",
};
</script>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { message } from "ant-design-vue";
import IMSDk from "../../src/index";

const content = ref("");
const history = ref<any>([]);
let chatroom: Chatroom;
const handleSend = async () => {
  const [error, msg] = await chatroom.sendText(content.value);
  if (error === null) {
    message.success("发送成功");
    content.value = "";
  }
};

const getHistoryMsgs = () => {
  chatroom.getAllHistoryMsgs().then((res: any) => {
    console.log("history", res);
    history.value = res;
  });
};

const getAllChatroomMembers = async () => {
  const res = await chatroom.getAllChatroomMembers();
  console.log(res);
};

const handleUpdate = async () => {
  const [error, obj] = await chatroom.updateChatroom({
    chatroom: {
      name: "公告更新",
      announcement: "公告更新测试",
    },
    needNotify: true,
  });
  if (error === null) {
    console.log(obj);
    message.success("公告更新成功");
  }
};

onBeforeMount(() => {
  chatroom = IMSDk.Chatroom.getInstance({
    appKey: "678ddcd03a3225cd7932d2ecef09d246", // appkey
    chatroomId: "2302150639", // 聊天室
    account: "1", // 账号
    token: "6ad10018fb443cf3851510f812d9bba2", // 凭证
    chatroomAddresses: [
      "chatweblink12.netease.im:443",
      "chatweblink11.netease.im:443",
    ], // 聊天室地址
    chatroomNick: "Nets", // 昵称
    chatroomAvatar: "https://joeschmoe.io/api/v1/random", // 头像
    onconnect(obj) {
      console.log("聊天室:", obj.chatroom);
      console.log("登录账号:", obj.member);
      getHistoryMsgs();
    },
  });

  // 成员进入
  chatroom.addListener(ChatroomNotifiyType.memberEnter, function (res) {
    console.log("memberEnter", res);
  });

  // 聊天室信息更新
  chatroom.addListener(ChatroomNotifiyType.updateChatroom, function (res) {
    console.log("updateChatroom", res);
  });
});
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
.ant-layout {
  height: 100%;
}
.warpper {
  width: 100vw;
  height: 100vh;
  min-height: 730px;
  background: #d8dee5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.chatroom {
  display: flex;
  flex-direction: column;
  width: 1070px;
  height: 670px;
  background: linear-gradient(180deg, #fff 5.25%, #fff 117.69%);
  border-radius: 6px;
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 51px;
    font-size: 18px;
  }
  &-main {
    display: flex;
    height: 619px;
    flex-direction: row;
    flex: 1;
    .members {
      width: 270px;
      height: 100%;
      border-top: 1px solid #f0f1f2;
      border-right: 1px solid #f0f1f2;
      .member {
        width: 100%;
        display: flex;
        padding: 12px;
        background-color: #fff;
        position: relative;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        align-items: center;
        padding: 12px;
      }
    }
    .chat-warpper {
      display: flex;
      width: 100%;
      height: 100%;
      background: #f6f8fa;
      flex-direction: column;
      .chat-list {
        width: 100%;
        flex: 1;
        overflow: auto;
        .chat-item {
          padding: 6px 12px;
          .nickname {
            padding-left: 5px;
            padding-right: 10px;
          }
        }
      }
      .chat-footer {
        padding: 16px;
        .chat-message-input-wrap {
          display: flex;
          position: relative;
          background: #fff;
          border-radius: 4px;
          align-items: center;
          border: 1px solid #dde0e5;
          .ant-input {
            padding: 0 10px;
            border: none;
            height: 46px;
            line-height: 46px;
          }
          .ant-btn {
            width: 100px;
            height: 46px;
            border-radius: 0;
          }
        }
      }
    }
  }
}
</style>
