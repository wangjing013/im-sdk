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
* 查询成员列表 ✅
* 分页获取成员列表 ✅
* 查询全部历史消息 ✅
* 分页查询历史消息 ✅
* 进入聊天室 ✅
* 离开聊天室 ✅
* 发送文本消息 ✅
* 发送文件消息 ✅
* 接收聊天室消息 ✅
* 聊天室禁言 ✅
* 单个禁言 ✅
* 临时禁言 ✅
* 踢出(发、收)
* 拉黑(发、收)
* 上报观看时长
* 记录发言次数
* 快捷添加严禁词
* 备注


### 4.1 登录
```ts
  const chatroom = IMSDk.Chatroom.getInstance({
    appKey: "**", // appkey
    chatroomId: "**", // 聊天室
    account: "**", // 账号
    token: "**", // 凭证
    chatroomAddresses: [
      "chatweblink12.netease.im:443",
      "chatweblink11.netease.im:443",
    ],  // 聊天室地址
    chatroomNick: "Nets", // 昵称
    chatroomAvatar: "https://joeschmoe.io/api/v1/random", // 头像
    onconnect({chatroom , member}) {
      console.log("聊天室:", chatroom);
      console.log("当前登录账号:", member);
      // todo init
    },
  });
```

### 4.2 查询聊天室信息

* 发送请求

```ts
  const [error, obj] = await chatroom.getChatroom();
  if(!error){
    console.log(obj);
  }
```

* 响应结果:

```ts
{
  "id": "2302150639",
  "name": "公告更新", // 公告名称
  "announcement": "公告更新测试",  // 公告内容
  "custom": "", 
  "createTime": 1663321877624,
  "updateTime": 1663741386352,
  "queuelevel": "1",
  "creator": "0",
  "onlineMemberNum": 3,
  "mute": false,
  "broadcastUrl": ""
}
```

### 4.3 修改聊天室信息

* 请求

```ts
  const [error, obj] = await chatroom.updateChatroom({
    chatroom: {
      name: "公告更新",
      announcement: "公告更新测试",
    },
    custom: JSON.stringify({
      announcement: "公告更新测试",
    }),
    needNotify: true,
  });
  if (error === null) {
    message.success("修改聊天室信息成功");
  }
```

* 参数

| 参数      | 默认值 | 描述 |
| ----------- | ----------- | ----------- |
| name      | ""       | 公告名称 |
| announcement   | ""        | 公告内容 |
| custom   |  ""      | 扩展字段 |
| needNotify| false | 默认为 false, 表示公告修改不通知聊天室其它人. 反之通知|

*  响应结果

```ts
// obj 对应内容
{
    "chatroom": {
        "name": "公告更新",
        "announcement": "公告更新测试"
    },
    "needNotify": true,
    "custom": "{\"announcement\":\"公告更新测试\"}",
    "antispamTag": {}
}
```

* 学员端监听公告更新

```ts
// 聊天室信息更新
chatroom.addListener(ChatroomNotifiyType.updateChatroom, function (res) {
  console.log("updateChatroom", res);
});
```

接收到 ``res`` 内容如下:

```json
{
  "chatroomId": "2302150639",
  "idClient": "102baa94-ef75-48bb-ad83-8d0d888ef5a2",
  "from": "1",
  "fromCustom": "",
  "fromClientType": "Web",
  "time": 1663762645958,
  "type": "notification",
  "text": "",
  "resend": false,
  "status": "success",
  "attach": {
      "type": "updateChatroom",
      "from": "1",
      "fromNick": "管理员1",
      "custom": "{\"announcement\":\"公告更新测试\"}"
  },
  "flow": "in"
}
```

### 4.4 查询成员列表
```ts
  const members = await chatroom.getAllChatroomMembers();
  console.log(members);
```

### 4.5 分页获取成员列表
```ts
  const [error, members] = await chatroom.getChatroomMembers({
    guest = false, 
    limit = 100,  
    time = 0,  
  }
  if(error!=null) {
    console.log(members)
  }
```

| 参数      | 默认值 | 描述 |
| ----------- | ----------- | ----------- |
| guest      | false       | 只查询固定用户(非游客) |
| limit   | 100        |查询数量|
| time| 0 |默认 0 代表当前服务器时间，获取固定用户传入 updateTime，获取游客用户传入 enterTime|


### 4.6 查询全部历史消息
```ts
chatroom.getAllHistoryMsgs().then((res: any) => {
  history.value = res;
});
```

### 4.7 分页查询历史消息
```ts
chatroom.getHistoryMsgs({
  timetag = Date.now(), // 默认值
  limit = 100, // 查询条数
  msgTypes = [], // 查询指定类型的消息
})
```

| 参数      | 默认值 | 描述 |
| ----------- | ----------- | ----------- |
| timetag  | false   | 获取从 timetag 对应的时间点往前的若干条数据 |
| limit   | 100  | 查询数量 |
| msgTypes | [] |可选历史消息类型，默认为即获取全部消息类型|

### 4.8 进入聊天室
```ts
// 成员进入
chatroom.addListener(Chatroom.EVENTS.memberEnter, function (res) {
  console.log("memberEnter", res);
  message.info(`[${res.attach.fromNick}] 进入聊天室`);
});
```
### 4.9 离开聊天室
```ts
// 离开聊天
chatroom.addListener(Chatroom.EVENTS.memberExit, function (res) {
  console.log("memberExit", res);
  message.info(`[${res.attach.fromNick}] 离开聊天室`);
});
```

### 4.10 发送文本消息
```ts
const handleSend = async () => {
  const [error, msg] = await chatroom.sendText(content.value);
  if (error === null) {
    message.success("发送成功");
    content.value = "";
  }
};
```
### 4.11 发送文件消息
```ts
chatroom.sendFile({
  type: "image", // "image" | "audio" | "video" | "file";
  fileInput: fileInput, // blob | HTMLInputElement | base64
  uploadprogress: (obj) => {},
  uploaddone: (error, file) => {},
  beforesend: (msg) => {},
  done: (error, msg) => {};
});
```

### 4.12 接收聊天室消息
#### 4.12.1 消息分类4大类

| 事件名称      | 描述 |
| ----------- | ----------- | 
| normal      | 普通消息(text、image、audio、video、file、geo)| 
| tip   | 提醒消息(如进入会话时出现的欢迎消息，或者会话命中敏感词后的提示消息等等) |
| notification | 通知消息 |
| custom| 自定义 |

#### 4.12.2 接收普通消息
```ts
chatroom.addListener(Chatroom.EVENTS.normal, function(msg) {})
```

### 4.13 聊天室禁言

```ts

chatroom.addListener(Chatroom.EVENTS.muteRoom, function(msg) {}) // 聊天室被禁言
chatroom.addListener(Chatroom.EVENTS.unmuteRoom, function(msg) {}) // 聊天室解除禁言
```

### 4.14 单禁言
```ts
const [error, obj] = chatroom.markChatroomGaglist({
  account: "****",
  isAdd: true, // 添加禁言：true、移除禁言：false
})
if(error === null) {
  console.log("禁言|取消禁言成功")
}

// 禁言
chatroom.addListener(Chatroom.EVENTS.gagMember, function(){})
// 移除禁言
chatroom.addListener(Chatroom.EVENTS.ungagMember, function(){})
```

### 4.15 临时禁言
```ts
const [error, obj] = chatroom.updateChatroomMemberTempMute({
  account: "****",
  duration: 1000, // 禁言时长: 单位为秒 移除禁言：0
  needNotify: true, // 禁言：true、移除禁言：false
  custom: "" // 对应消息的扩展字段
})

if(error === null) {
  console.log("禁言|取消禁言成功")
}

// 禁言
chatroom.addListener(Chatroom.EVENTS.addTempMute, function(){})
// 移除禁言
chatroom.addListener(Chatroom.EVENTS.removeTempMute, function(){})
```






