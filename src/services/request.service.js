import { RoomHandlerCreator } from '../controllers/room.controller';
import { Player, PlayerCreator } from '../models/player.model';

const PORT = process.env.PORT || 8999;

class RequestService {
	constructor(app) {
        app.post('/create', this.createRoom);
        app.put('/join/:roomcode', this.joinRoom);
        app.get('/room', this.getRoom);

        app.listen(process.env.PORT || 3001);
    }

    createRoom(req, res) {
        // creates a websocket and returns a room code that can be used to interact with the websocket
		let roomHandler = new RoomHandlerCreator.getInstance();
        let room = roomHandler.addRoom();

        res.send({
            success: true,
            room: room,
            web_socket_url: `ws://localhost:${PORT}`
        });
    }

    joinRoom(req, res) {
        let { roomCode } = req.params;
        let { player } = req.body;

        // Check if roomcode given
		if (!roomcode) {
            res.status(422);
            res.send({
                success: false,
				errors: [
					{
                    message: 'no_room_code_given'
					}
				]
            });
            return;
        }

        let playerObj = PlayerCreator.createPlayer(player);

        if (!playerObj.success) {
            res.status(422);
            res.send({ playerObj });
            return;
        }

		let roomHandler = RoomHandlerCreator.getInstance();
		let room = roomHandler.getRoom(roomcode);

        // Check if room exists
        if (!room) {
            res.status(404);
            res.send({
                success: false,
				errors: [
					{
                    message: 'no_room_by_code'
					}
				]
            });
            return;
        }

        //Check if room is full
        if (room.isFull) {
            res.status(403);
            res.send({
                success: false,
				errors: [
					{
                    message: 'room_is_full'
					}
				]
            });
            return;
        }

        if (room.isInProgress) {
            res.status(403);
            res.send({
                success: false,
				errors: [
					{
                    message: 'room_is_in_progress'
					}
				]
            });
            return;
        }

        if (room.hasPlayer(playerObj.player)) {
            res.status(403);
            res.send({
                success: false,
				errors: [
					{
                    message: 'room_already_has_player'
					}
				]
            });
            return;
        }

        roomHandler.addPlayerToRoom(room, playerObj.player);

		console.log(`Player ${playerObj.player.name} has joined room ${room.roomcode}`);
        res.send({
            success: true,
            room: room,
            player: playerObj.player,
            web_socket_url: `ws://localhost:${PORT}`
        });
    }

    getRoom(req, res) {
		let roomcode = req.query.room;
        // Check if room exists
		if (!roomcode) {
            res.status(400);
            res.send({
                success: false,
				errors: [
					{
                    message: 'no_room_code_given'
					}
				]
            });
            return;
        }

        let roomHandler = RoomHandlerCreator().getInstance();
		let room = roomHandler.getRoom(roomcode);

        // Check if room exists
        if (!room) {
            res.status(404);
            res.send({
                success: false,
				errors: [
					{
                    message: 'no_room_by_code'
					}
				]
            });
            return;
        }

        res.send({
            success: true,
            room: room
        });
    }
}

export class RequestServiceCreator {
    constructor() {}

	static getInstance() {
        return RequestServiceCreator.instance;
    }

    static createService(app) {
        if (!RequestServiceCreator.instance) {
            RequestServiceCreator.instance = new RequestService(app);
        }

        return RequestServiceCreator.instance;
    }
}
