class RoomController {
    constructor(webSocketController) {
        this.rooms = {};
        this.characters = [
            "A", "B", "C", "D", "E", "F",
            "G", "H", "I", "J", "K", "L",
            "M", "N", "O", "P", "Q", "R",
            "S", "T", "U", "V", "W", "X",
            "Y", "Z", "0", "1", "2", "3",
            "4", "5", "6", "7", "8", "9",
            "0"
        ];

        this.webSocketController = webSocketController;
        webSocketController.addCallBack('room', this.onEvent);
    }

    addRoom() {
        var roomCode = this.getRandomRoomCode();
        this.rooms[roomCode] = roomCode;
        return roomCode;
    }

    deleteRoom() {
        // TODO when do rooms get deleted?
    }

    getRoom(roomCode) {
        return this.rooms[roomCode];
    }

    addPlayerToRoom(room, player) {
        this.rooms[room.roomCode].addPlayer(player);
        let obj = { room: this.rooms[room.roomCode] };
        this.webSocketController.sendToRoom(room.roomCode, 'add-player', obj);
    }

    getRandomRoomCode() {
        var found = false;
    
        while (!found) {
            var number1 = Math.floor(Math.random() * this.characters.length);
            var number2 = Math.floor(Math.random() * this.characters.length);
            var number3 = Math.floor(Math.random() * this.characters.length);
            var number4 = Math.floor(Math.random() * this.characters.length);
    
            var code = this.characters[number1] + this.characters[number2] + this.characters[number3] + this.characters[number4];
    
            found = typeof this.rooms[code] === 'undefined';
        }
        
        return code;
    }

    onEvent(obj) {
        let { action } = obj;


    }
}

export class RoomHandlerCreator {
    constructor() {}
    
    static createController(webSocketController) {
        if (!RoomHandlerCreator.instance) {
            RoomHandlerCreator.instance = new RoomController(webSocketController);
        }

        return RoomHandlerCreator.instance;
    }
}