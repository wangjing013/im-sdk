<template>
  <a-layout>
    <a-layout-content>
      <div class="warpper">
        <div class="chatroom">
          <div class="top">聊天室</div>
          <div class="chatroom-main">
            <div class="members">
              <div class="member">张三</div>
              <div class="member">李四</div>
              <div class="member">王五</div>
              <div class="member">赵六</div>
            </div>
            <div class="chat-warpper">
              <div class="chat-list"></div>
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
export default {
  name: "AppComponent",
};
</script>

<script lang="ts" setup>
import IMSDk from "../../src/index";
import { onBeforeMount, ref } from "vue";
let chatroom: any = null;
const content = ref("");
const handleSend = () => {
  chatroom.sendText(content.value);
};

const getHistoryMsgs = () => {
  chatroom.getAllHistoryMsgs().then((res: any) => {
    console.log(res);
  });
};
onBeforeMount(() => {
  chatroom = IMSDk.Chatroom.getInstance({
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
      getHistoryMsgs();
    },
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
