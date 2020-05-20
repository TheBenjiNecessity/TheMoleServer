class WebSocketController {
    constructor(io) {
        this.callbacks = {};
        this.socket = {};

        io.on('connection', (socket) => {
            socket.on('join', data => this.onJoin(socket, data));

            this.socket = socket;
        });
    }

    onJoin(socket, data) {
        let { room } = data;
        socket.join(room.roomcode);
    }

    addEvent(name, callback) {
        if (typeof callback === 'function') {
            this.socket.on(name, callback);
            return true;
        } else {
            return false;
        }
    }

    sendToRoom(roomcode, action, obj) {
        let jsonString = JSON.stringify(obj);
        io.to(roomcode).emit(action, jsonString);
    }
}

export class WebSocketControllerCreator {
    constructor() {}

    static createController(io) {
        if (!WebSocketControllerCreator.instance) {
            WebSocketControllerCreator.instance = new WebSocketController(io);
        }

        return WebSocketControllerCreator.instance;
    }
}