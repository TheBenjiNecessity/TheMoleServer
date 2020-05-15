var express = require('express');
var http = require('http');
var cors = require('cors');

import { RequestServiceCreator } from './services/request.service';
import { WebSocketControllerCreator } from './services/websocket.service';
import { RoomHandlerCreator } from './controllers/room.controller';

const app = require('express')();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(cors());
server.listen(process.env.PORT || 8999);

let webSocketController = WebSocketControllerCreator.createController(io);
RequestServiceCreator.createService(app);

RoomHandlerCreator.createController(webSocketController);

/**
 * Client requests:
 * - Create a room and join it
 * - or join an existing room
 * 
 * Client Socket:
 * - 
 */