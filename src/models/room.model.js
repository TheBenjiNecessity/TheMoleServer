export class Room {
    get isFull() {
        return this.players.length === 10;
    }

    get isInProgress() {
        return this.inProgress;
    }

    constructor(roomCode) {
        this.roomCode = roomCode;
        this.state = null;
        this.players = {};
        this.inProgress = false;
    }

    addPlayer(player) {
        this.players[player.name] = player;
    }

    startGame() {
        this.inProgress = true;
    }

    hasPlayer(player) {
        let roomPlayer = this.players[player.name];
        return typeof roomPlayer !== 'undefined';
    }
}