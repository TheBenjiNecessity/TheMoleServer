var WebSocket = require('ws');

export class WebSocketController {
    constructor(server) {
        //initialize the WebSocket server instance
        const wss = new WebSocket.Server({ server });
            
        wss.on('connection', this.webSocketConnectionInit);

        //start our server
        server.listen(process.env.PORT || 8999, () => {
            console.log(`Server started on port ${server.address().port} :)`);
        });
    }

    webSocketConnectionInit(ws) {
         //connection is up, let's add a simple simple event
         ws.on('message', this.webSocketMessage);

        //send immediatly a feedback to the incoming connection    
        ws.send('Hi there, I am a WebSocket server');
    }

    webSocketMessage(message) {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    }
}