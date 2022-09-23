<template>
  <a-layout>
    <a-layout-content>
      <div>
        <input id="test" type="file" />
        <a-button @click="handleUpload">上传</a-button>
        <a-button @click="getAllChatroomMembers">获取成员列表</a-button>
        <a-button @click="handleUpdate">更新公告信息</a-button>
        <a-button @click="handleMute">单个聊天室禁言</a-button>
        <a-button @click="handleLeave">退出聊天室</a-button>
        <a-button @click="handlekickChatroomMember">踢出直播间</a-button>
      </div>
      <div class="warpper">
        <div class="chatroom">
          <div class="top">聊天室</div>
          <div class="chatroom-main">
            <div class="members">
              <div v-for="item of members" :key="item.account">
                {{ item.nick }}-{{ item.online ? "在线" : "离线" }}
              </div>
            </div>
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
import Chatroom, {
  ChatroomNotifiyType,
  Member,
  Message,
} from "../../../src/chatroom";
import { useRoute } from "vue-router";
export default {
  name: "HomeComponent",
};
</script>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { message } from "ant-design-vue";
import IMSDk from "../../../src/index";

const route = useRoute();
const content = ref("");
const history = ref<Message[]>([]);
const members = ref<Member[]>([]);
let chatroom: Chatroom;

const handleSend = async () => {
  const [error, msg] = await chatroom.sendText(content.value);
  if (error === null) {
    message.success("发送成功");
    content.value = "";
  }
};

const getHistoryMsgs = () => {
  chatroom.getAllHistoryMsgs().then((res: Message[]) => {
    console.log("history", res);
    history.value = res;
  });
};

const getAllChatroomMembers = async () => {
  const res = await chatroom.getAllChatroomMembers();
  console.log("getAllChatroomMembers", res);
  members.value = res;
};

const handleUpdate = async () => {
  const [error, obj] = await chatroom.updateChatroom({
    chatroom: {
      name: "公告更新",
      announcement: "公告更新测试",
    },
    needNotify: true,
    custom: JSON.stringify({
      announcement: "公告更新测试",
    }),
  });
  console.log(error, obj);
};

const handleMute = async () => {
  const [error, result] = await chatroom.markChatroomGaglist({
    account: "3",
    isAdd: true,
  });
  console.log(error, result);
};

const handleLeave = async () => {
  chatroom.disconnect();
};

const handlekickChatroomMember = async () => {
  const [error, result] = await chatroom.kickChatroomMember({
    account: "3",
  });
  if (error) {
    console.log(error.message);
  }
};

// 发送图片文件
const handleUpload = async () => {
  const input = document.querySelector("#test");
  if (input) {
    chatroom.sendFile({
      type: "image",
      fileInput: input,
      uploadprogress(obj) {},
      beforesend(msg) {},
      uploaddone(error, file) {},
      done(error, msg) {
        console.log(error, msg);
      },
    });
  }
};

onBeforeMount(() => {
  const { token, account } = route.query;
  chatroom = IMSDk.Chatroom.getInstance({
    account: account as string,
    token: token as string,
    appKey: "678ddcd03a3225cd7932d2ecef09d246",
    chatroomId: "2302150639",
    chatroomAddresses: [
      "chatweblink12.netease.im:443",
      "chatweblink11.netease.im:443",
    ],
    chatroomNick: "", // 昵称
    chatroomAvatar: "", // 头像
    chatroomEnterCustom: JSON.stringify({
      avatar: "https://joeschmoe.io/api/v1/random",
    }),
  });

  // 登录成功
  chatroom.addListener(Chatroom.EVENTS.loginSuccess, function (obj) {
    console.log("聊天室:", obj.chatroom);
    console.log("登录账号:", obj.member);
    getHistoryMsgs();
    getAllChatroomMembers();
  });

  // 成员进入
  chatroom.addListener(Chatroom.EVENTS.memberEnter, async function (res) {
    const [error, obj] = await chatroom.getChatroomMembersInfo({
      accounts: [res.from],
    });
    console.log(error, obj);
    message.info(`[${res.attach.fromNick}] 进入聊天室`);
  });

  // 聊天室信息更新
  chatroom.addListener(Chatroom.EVENTS.updateChatroom, function (res) {
    console.log("updateChatroom", res);
  });

  // 离开聊天
  chatroom.addListener(Chatroom.EVENTS.memberExit, function (res) {
    console.log("memberExit", res);
    message.info(`[${res.attach.fromNick}] 离开聊天室`);
  });

  // 监听普通消息
  chatroom.addListener(Chatroom.EVENTS.normal, function (res) {
    console.log("normal message", res);
    history.value.unshift(res);
  });

  // 监听提示消息
  chatroom.addListener(Chatroom.EVENTS.tip, function (res) {
    console.log("tip message", res);
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
