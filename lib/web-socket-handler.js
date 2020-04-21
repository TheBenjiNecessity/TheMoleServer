"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketController = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebSocket = require('ws');

var WebSocketController = /*#__PURE__*/function () {
  function WebSocketController(server) {
    _classCallCheck(this, WebSocketController);

    //initialize the WebSocket server instance
    var wss = new WebSocket.Server({
      server: server
    });
    wss.on('connection', this.webSocketConnectionInit); //start our server

    server.listen(process.env.PORT || 8999, function () {
      console.log("Server started on port ".concat(server.address().port, " :)"));
    });
  }

  _createClass(WebSocketController, [{
    key: "webSocketConnectionInit",
    value: function webSocketConnectionInit(ws) {
      //connection is up, let's add a simple simple event
      ws.on('message', this.webSocketMessage); //send immediatly a feedback to the incoming connection    

      ws.send('Hi there, I am a WebSocket server');
    }
  }, {
    key: "webSocketMessage",
    value: function webSocketMessage(message) {
      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send("Hello, you sent -> ".concat(message));
    }
  }]);

  return WebSocketController;
}();

exports.WebSocketController = WebSocketController;