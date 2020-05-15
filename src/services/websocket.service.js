class WebSocketController {
    constructor(io) {
        this.callbacks = {};

        io.on('connection', (socket) => {
            socket.on('join', data => this.onJoin(socket, data));
            socket.on('event', this.onEvent);
        });
    }

    onJoin(socket, data) {
        let { room } = data;
        socket.join(room.roomcode);
    }

    onEvent(jsonString) {
        let data = JSON.parse(jsonString);
        let { action } = data;

        if (this.callbacks[action]) {
            this.callbacks[action](data.event);
        }
    }

    sendToRoom(roomcode, action, obj) {
        let jsonString = JSON.stringify(obj);
        io.to(roomcode).emit(action, jsonString);
    }

    addCallBack(type,  callback) {
        if (typeof callback === 'function') {
            this.callbacks[type] = callback;
        }
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