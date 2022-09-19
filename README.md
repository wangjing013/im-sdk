# IM-SDK

## 安装

```shell
yarn add @msbfe/im-sdk
```

## 前置依赖

```shell
yarn add @yxim/nim-web-sdk
npm i @yxim/nim-web-sdk
```

## 功能

### 初始化

```ts
const chatroom = IMSDk.Chatroom.getInstance({
  appKey: "678ddcd03a3225cd7932d2ecef09d246", // appkey
  account: "1", // 账号
  token: "6ad10018fb443cf3851510f812d9bba222", // 凭证
  chatroomId: "2302150639", // 聊天室
  chatroomAddresses: [
    "chatweblink12.netease.im:443",
    "chatweblink11.netease.im:443",
  ], // 聊天室地址
  chatroomNick: "", // 昵称
  chatroomAvatar: "", // 头像
  onconnect() {
    chatroom.getChatroom().then(
      (roominfo) => {
        console.log(roominfo);
      },
      (error) => console.log(error)
    );
  },
});
```

### 获取聊天室信息

```json
chatroom.getChatroom().then(
    (roominfo) => {
        console.log(roominfo);
    },
    (error) => console.log(error)
);
```

### 获取成员列表
### 发送消息


