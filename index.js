const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let messageCount = 0;
let interval;

wss.on('connection', function connection(ws) {

  ws.send("Listen");

  ws.on('message', function incoming(message) {    
    console.log("message received: " + message);
    if(message == "Start") {
        interval = setInterval(function(){
            ws.send("Ping " + messageCount);
            messageCount += 1;
        }, 1000);
    }
    if(message == "Stop" && interval) {
        clearInterval(interval);
        ws.send("Terminated");
    }
  });  
});