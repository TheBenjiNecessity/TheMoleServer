class RoomHandler {
    constructor() {
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
    }
    
    addRoom() {
        var roomCode = getRandomRoomCode();
        rooms[roomCode] = roomCode;
        return roomCode;
    }
    
    getRandomRoomCode() {
        var found = false;
    
        while (!found) {
            var number1 = Math.floor(Math.random() * characters.length);
            var number2 = Math.floor(Math.random() * characters.length);
            var number3 = Math.floor(Math.random() * characters.length);
            var number4 = Math.floor(Math.random() * characters.length);
    
            var code = characters[number1] + characters[number2] + characters[number3] + characters[number4];

            console.log('rooms', rooms);
    
            found = typeof rooms[code] === 'undefined';
        }
        
        return code;
    }
}

export class RoomHandlerCreator {
    constructor() {
        if (!RoomHandlerCreator.instance) {
            RoomHandlerCreator.instance = new RoomHandler();
        }
    }

    getInstance() {
        return RoomHandlerCreator.instance;
    }
}