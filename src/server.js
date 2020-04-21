var express = require('express');
var http = require('http');
var cors = require('cors');

import { RequestController } from './request-handler';
import { WebSocketController } from './web-socket-handler';

const app = express();
const server = http.createServer(app);

app.use(cors());

let wsController = new WebSocketController(server);
let rController = new RequestController(app);

app.listen(process.env.PORT || 3001);