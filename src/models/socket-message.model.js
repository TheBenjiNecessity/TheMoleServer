export class SocketMessage {
    constructor(type, action, room) {
        this.type = type;
        this.action = action;
        this.room = room;
    }
}