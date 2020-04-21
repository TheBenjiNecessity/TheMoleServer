import {RoomHandlerCreator} from './room-handler';

export class RequestController {
    constructor (app) {
        app.get('/host', this.loadHost); 
    }

    loadHost(req, res) {
        // creates a websocket and returns a room code that can be used to interact with the websocket
        let roomHandler = RoomHandlerCreator().getInstance();
        let room = roomHandler.addRoom();

        res.send({
            error: false,
            room: room,
            web_socket_url: 'ws://localhost:' + process.env.PORT || 8999
        });
    }
}