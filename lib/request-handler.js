"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestController = void 0;

var _roomHandler = require("./room-handler");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RequestController = /*#__PURE__*/function () {
  function RequestController(app) {
    _classCallCheck(this, RequestController);

    app.get('/host', this.loadHost);
  }

  _createClass(RequestController, [{
    key: "loadHost",
    value: function loadHost(req, res) {
      // creates a websocket and returns a room code that can be used to interact with the websocket
      var roomHandler = (0, _roomHandler.RoomHandlerCreator)().getInstance();
      var room = roomHandler.addRoom();
      res.send({
        error: false,
        room: room,
        web_socket_url: 'ws://localhost:' + process.env.PORT || 8999
      });
    }
  }]);

  return RequestController;
}();

exports.RequestController = RequestController;