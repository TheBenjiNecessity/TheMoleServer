"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketControllerCreator = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//var WebSocket = require('ws');
var WebSocketServer = require('websocket').server;

var WebSocketController = /*#__PURE__*/function () {
  function WebSocketController(server) {
    _classCallCheck(this, WebSocketController);

    //initialize the WebSocket server instance
    // const wss = new WebSocket.Server({ server });
    // wss.on('connection', this.webSocketConnectionInit);
    //start our server
    server.listen(process.env.PORT || 8999, function () {
      console.log("Server started on port ".concat(server.address().port, " :)"));
    });
    var wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
    });
    wsServer.on('request', function (request) {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      var connection = request.accept('echo-protocol', request.origin);
      console.log(new Date() + ' Connection accepted.');
      connection.on('message', this.connectionOnMessage);
      connection.on('close', this.connectionClose);
    });
  }

  _createClass(WebSocketController, [{
    key: "originIsAllowed",
    value: function originIsAllowed(origin) {
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }
  }, {
    key: "connectionOnMessage",
    value: function connectionOnMessage(message) {
      if (message.type === 'utf8') {
        console.log('Received Message: ' + message.utf8Data);
        connection.sendUTF(message.utf8Data);
      } else if (message.type === 'binary') {
        console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        connection.sendBytes(message.binaryData);
      }
    }
  }, {
    key: "connectionClose",
    value: function connectionClose(reasonCode, description) {
      console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
    } // webSocketConnectionInit(ws) {
    //      //connection is up, let's add a simple simple event
    //      ws.on('message', this.webSocketMessage);
    //     //send immediatly a feedback to the incoming connection    
    //     ws.send('Hi there, I am a WebSocket server');
    // }
    // webSocketMessage(message) {
    //     //log the received message and send it back to the client
    //     console.log('received: %s', message);
    //     ws.send(`Hello, you sent -> ${message}`);
    // }

  }]);

  return WebSocketController;
}();

var WebSocketControllerCreator = /*#__PURE__*/function () {
  function WebSocketControllerCreator() {
    _classCallCheck(this, WebSocketControllerCreator);
  }

  _createClass(WebSocketControllerCreator, [{
    key: "getInstance",
    value: function getInstance() {
      return WebSocketControllerCreator.instance;
    }
  }], [{
    key: "createController",
    value: function createController(server) {
      if (!WebSocketControllerCreator.instance) {
        WebSocketControllerCreator.instance = new WebSocketController(server);
      }

      return WebSocketControllerCreator.instance;
    }
  }]);

  return WebSocketControllerCreator;
}();

exports.WebSocketControllerCreator = WebSocketControllerCreator;