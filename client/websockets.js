(function() {

const logInfo = function(text) {
    const pre = document.querySelector('#MyConsole');    
    pre.innerHTML += text + "\n";
};

const terminateLink = document.querySelector('a.terminate');
terminateLink.style.display = "none";

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
    logInfo("Connection open; Message Sent");
}); 

// Connection opened
socket.addEventListener('close', function (event) {    
    logInfo("Connection closed by the server.");
});

// Listen for messages
socket.addEventListener('message', function (event) {    
    if(event.data == "Listen") {
        logInfo("Server says it is listening, triggering now");        
        terminateLink.style.display = "block";
        socket.send("Start");
    } else {
        logInfo("Message: " + event.data);
    }
});

terminateLink.addEventListener('click', function(event) {
    event.preventDefault();
    socket.send('Stop');
    logInfo("Stop requested.");
    terminateLink.style.display = "none";
});

})();