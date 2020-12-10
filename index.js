const WebSocket = require('ws');
const WebHandler = require('serve-handler');
const http = require('http');
const { spawn } = require("child_process");

const object_encode = object => "JSON:" + JSON.stringify(object);

const perform_task = (command, args, socket) => {
  socket.send("Calling command `" + command + "` with args: " + args.join(" "));
  const task = spawn(command, args);
  task.stdout.on("data", data => socket.send(object_encode({type: "stdout", text: data.toString('utf-8')})));
  task.stderr.on("data", data => socket.send(object_encode({type: "stderr", text: data.toString('utf-8')})));
  task.on("error", error => socket.send(`error reported: ${error.message}`));
  task.on("close", code => socket.send(`Command ${command} completed with exit code: ${code}`));
};

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

wss.on('connection', function connection(ws) {  
  ws.send("Listen");
  console.log("Websockets server estabilished connection");

  ws.on('message', function incoming(message) {    
    console.log("message received: " + message);
    if(message == "Install") {
      perform_task("npm", ["install"], ws);    
    }    
  });  
});

