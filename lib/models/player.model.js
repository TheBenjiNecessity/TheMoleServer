"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerCreator = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(name) {
  _classCallCheck(this, Player);

  this.name = name;
};

var PlayerCreator = /*#__PURE__*/function () {
  function PlayerCreator() {
    _classCallCheck(this, PlayerCreator);
  }

  _createClass(PlayerCreator, null, [{
    key: "createPlayer",
    value: function createPlayer(player) {
      if (!player) {
        return {
          success: false,
          errors: [{
            error: 'player_data_not_given'
          }]
        };
      }

      if (!player.name) {
        return {
          success: false,
          errors: [{
            error: 'name_not_given'
          }]
        };
      }

      return {
        success: true,
        player: new Player(player)
      };
    }
  }]);

  return PlayerCreator;
}();

exports.PlayerCreator = PlayerCreator;