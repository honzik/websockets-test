(function() {

    const logInfo = function(text) {
        const pre = document.querySelector('#MyConsole');    
        pre.innerHTML += text + "\n";
    };

    const logOutput = function(object) {
        const pre = document.querySelector('#Output');   
        console.log(object);
        pre.innerHTML += `[${object.type}] ${object.text}\n`;
    }

    const npmLink = document.querySelector('a.npm');
    npmLink.style.display = "none";

    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
        logInfo("Connection open; Message Sent");
    }); 

    // Connection closed
    socket.addEventListener('close', function (event) {    
        logInfo("Connection closed by the server.");
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {    
        if(event.data == "Error") {
            logInfo("Error in operation detected. Closing connection");
            socket.close();
        } else if(event.data == "Listen") {
            logInfo("Server ready for commands.");        
            npmLink.style.display = "block";                
        } else if(event.data.startsWith("JSON:")) {
            const object = JSON.parse(event.data.split("JSON:")[1]);
            logOutput(object);
        } else {
            logInfo("Message: " + event.data);
        }
    });

    npmLink.addEventListener('click', function(event) {
        event.preventDefault();
        socket.send('Install');
        logInfo("Npm install requested.");
        npmLink.style.display = "none";
    });

})();