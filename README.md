# IM-SDK

## 1. 安装

```shell
yarn add @msbfe/im-sdk
```

## 2. 前置依赖

```shell
yarn add @yxim/nim-web-sdk

// or

npm i @yxim/nim-web-sdk
```


## 3. 初始化
```ts
import IMSDK from '@msbfe/im-sdk'
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
  onconnect(obj) {
    console.log(obj.chatroom)
    console.log(obj.member)
  },
});
```

## 4. 功能

* 登录 ✅
* 查询聊天室信息 ✅
* 修改聊天室信息 ✅
* 查询在线人数(总共、离线、在线、游客) ✅
* 查询成员列表 ✅
* 全部历史消息 ✅
* 分页查询历史消息 ✅
* 发送文本消息 ✅
* 进入聊天室 ✅
* 离开聊天室 
* 发送图片消息
* 接收聊天室消息
* 禁言(发、收)
* 踢出(发、收)
* 拉黑(发、收)
* 上报观看时长
* 记录发言次数
* 快捷添加严禁词
* 备注


### 登录

```ts
  const chatroom = IMSDk.Chatroom.getInstance({
    appKey: "**", // appkey
    chatroomId: "**", // 聊天室
    account: "**", // 账号
    token: "**", // 凭证
    chatroomAddresses: [
      "chatweblink12.netease.im:443",
      "chatweblink11.netease.im:443",
    ], // 聊天室地址
    chatroomNick: "Nets", // 昵称
    chatroomAvatar: "https://joeschmoe.io/api/v1/random", // 头像
    onconnect(obj) {
      console.log("聊天室:", obj.chatroom);
      console.log("登录账号:", obj.member);
    },
  });
```
### 查询聊天室信息
```ts
  const [error, obj] = await chatroom.getChatroom();
  if(!error){
    console.log(obj);
  }
```

### 修改聊天室信息
```ts
  const [error, obj] = await chatroom.updateChatroom({
    chatroom: {
      name: "公告更新",
      announcement: "公告更新测试",
    },
    needNotify: true,
  });
  if (error === null) {
    message.success("公告更新成功");
  }
```

### 获取全部成员列表

```ts
  const members = await chatroom.getAllChatroomMembers();
  console.log(members);
```

### 分页获取成员列表

```ts
  const [error, members] = await chatroom.getChatroomMembers({
    guest = false, // 固定用户(非游客)
    limit = 100, // 限定
    time = 0, //  默认 0 代表当前服务器时间，获取固定用户传入 updateTime，获取游客用户传入 enterTime
  }
  if(error!=null) {
    console.log(members)
  }
```