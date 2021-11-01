const http = require("http");
const axios = require("axios");

function sendMsg(params) {
  axios
    .get("http://localhost:10002/MyQQHTTPAPI", { params })
    .then((res) => {
      // 发送成功返回的数据
      console.log(res.data);
    })
    .catch((err) => {
      // 发送失败返回的数据
      console.log(err);
    });
}

// 处理接收到的 MQ 对象
function handleMag(mqObj) {
  console.log("-----MQ消息对象，具体可启动应用查看-----", mqObj);

  const qqMsg = decodeURI(mqObj["MQ_msg"]);
  console.log("----接收到的QQ消息-----", qqMsg);

  const fromQQ = mqObj["MQ_fromQQ"];

  if (qqMsg === "你好") {
    sendMsg({
      function: "Api_SendMsgEx", // MyQQ HTTP插件里的api列表方法名称
      token: "666", // HTTPAPI设置的token
      c1: "24701789", // 机器人QQ
      c2: 0,
      c3: 1,
      c4: "",
      c5: fromQQ,
      c6: "Hello world！",
    });
  }
}

function main() {
  const server = http.createServer(function (req) {
    req.on("data", function (chunk) {
      const convertData = JSON.parse(chunk);

      handleMag(convertData);
    });
  });

  // 8888是你设置的回调函数的端口，可以自行修改
  server.listen(8888);
}

main();
