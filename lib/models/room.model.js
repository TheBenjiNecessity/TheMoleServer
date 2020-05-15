"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Room = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Room = /*#__PURE__*/function () {
  _createClass(Room, [{
    key: "isFull",
    get: function get() {
      return this.players.length === 10;
    }
  }, {
    key: "isInProgress",
    get: function get() {
      return this.inProgress;
    }
  }]);

  function Room(roomCode) {
    _classCallCheck(this, Room);

    this.roomCode = roomCode;
    this.players = {};
    this.inProgress = false;
  }

  _createClass(Room, [{
    key: "addPlayer",
    value: function addPlayer(player) {
      this.players[player.name] = player;
    }
  }, {
    key: "startGame",
    value: function startGame() {
      this.inProgress = true;
    }
  }, {
    key: "hasPlayer",
    value: function hasPlayer(player) {
      var roomPlayer = this.players[player.name];
      return typeof roomPlayer !== 'undefined';
    }
  }]);

  return Room;
}();

exports.Room = Room;