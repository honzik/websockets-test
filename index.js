const WebSocket = require('ws');
const WebHandler = require('serve-handler');
const http = require('http');

// web interface for users
const http_server = http.createServer((request, response) => {
  return WebHandler(request, response, {public: 'client'});
});
http_server.listen(5000, () => {
  console.log("Connect your browser to http://localhost:5000");
});

// websockets interface
const wss = new WebSocket.Server({ port: 8080 });
console.log("Websockets server ready on localhost:8080");

let messageCount = 0;
let interval;

wss.on('connection', function connection(ws) {  
  ws.send("Listen");
  console.log("Websockets server estabilished connection");

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