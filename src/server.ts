const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var http = require('http');
var cors = require('cors');

import RequestService from './services/request.service';
import WebSocketService from './services/websocket.service';
import RoomSocketHandler from './controllers/room.socket-handler';
import ChallengeService from './services/game/challenge.service';
import RoomController from './controllers/room.controller';

import './extensions/main';
import Room from './models/room.model';
import ChallengeSocketHandler from './controllers/challenge.socket-handler';
import ChallengeData from './interfaces/challenge-data';

const app = require('express')();
const server = http.createServer(app);
const io = require('socket.io')(server);

let rooms: { [id: string]: Room } = {};
let requestService: RequestService;
let roomSocketHandler: RoomSocketHandler;
let challengeSocketHandler: ChallengeSocketHandler;
let roomController: RoomController;
let webSocketService: WebSocketService;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cors());

ChallengeService.listChallengeData().then((challengeData: ChallengeData[]) => {
	webSocketService = new WebSocketService(io);
	roomController = new RoomController(
		webSocketService,
		challengeData,
		() => rooms,
		(r) => {
			rooms = r;
		}
	);

	requestService = new RequestService(app, roomController);

	io.on('connection', async (socket) => {
		socket.on('join', (roomcode) => {
			if (roomcode) {
				socket.join(roomcode);
			}
		});

		roomSocketHandler = new RoomSocketHandler(roomController, webSocketService, socket);
		challengeSocketHandler = new ChallengeSocketHandler(roomController, webSocketService, socket);

		for (let challengeDatum of challengeData) {
			challengeDatum.setupSocketHandler(roomController, webSocketService, socket);
		}
	});

	server.listen(process.env.PORT || 8999);

	console.log('Server started');
});
