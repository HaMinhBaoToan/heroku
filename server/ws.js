const WebSocket = require("ws");

const WS_PORT = 40567;
var CLIENTS = [];

let socketServer;
if (!socketServer) {
  socketServer = new WebSocket.Server({
    port: WS_PORT,
  });
  socketServer.on("connection", function (client) {
    // client.send('hello client');
    console.log(`A client has connected successfully`);

    // console.log(socketServer.clients);

    client.on("message", function (msg) {
      console.log(`nhận tin từ client: ${msg}`);
      CLIENTS.push({ _IDuser: msg, client });
      // console.log(CLIENTS);
    });
    // client.on("abcxyz", function (msg) {
    //   console.log(`nhận tin từ client: ${msg}`);
    // });
  });

  console.log(`WebSocket server is listening at port ${WS_PORT}`);
}

function sendMSGClient(listUser) {
  // for (const client of socketServer.clients) {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(msg);
  //   }
  // }
  //  console.log(CLIENTS)
  // for (const client of CLIENTS) {
  //   console.log(client.client)
  //   // if (client.client.readyState === WebSocket.OPEN) {
  //   //   client.client.send("msg");
  //   // }
  // }
  // for (const client of CLIENTS) {
  //   console.log(client._IDuser)
  // }
  // console.log(listUser)
  for (let i = 0; i < CLIENTS.length; i++) {
    // console.log(CLIENTS[i]) ;
    for (let j = 0; j < listUser.length; j++) {
      console.log(CLIENTS[i]._IDuser);
      console.log(listUser[j].UsersId);

      if (listUser[j].UsersId == CLIENTS[i]._IDuser) {
        var mes = {
          DislayName: listUser[j].NameTeacher,
          CategoryName: listUser[j].categoryName,
        };
        CLIENTS[i].client.send(JSON.stringify(mes));
      }
    }
  }
  // for(const item of listUser)
  // {
  //   // console.log(item.UsersId);
  //    for (const client of CLIENTS) {
  //       if(client._IDuser === item.UsersId)
  //       {
  //         console.log("có");
  //         break;
  //       }
  //       // if (client.client.readyState === WebSocket.OPEN) {
  //       //   client.client.send("msg");
  //       // }
  //     }
  // }
}

module.exports = {
  sendMSGClient,
};
