import RaisedHand from "./raisedHand.model";
import Role from "./role.model";
import Question from "./quiz/question.model";
import Player from "./player.model";

import "../extensions/date";
import StateObject from "./stateObject.interface";
import SimplifiedChallenge from "./simplified/challenge-simplified.model";

export default abstract class Challenge extends StateObject {
    static CHALLENGE_STATES = {
        CHALLENGE_EXPLANATION: "challenge-explanation",
        ROLE_SELECTION: "role-selection",
        IN_GAME: "game",
        CHALLENGE_END: "end",
    };

    agreedPlayerNames: string[];
    raisedHands: RaisedHand[];
    votedPlayers: any;
    isChallengeRunning: boolean;
    currentTime: number;
    roles: Role[];
    pointsWon: number;
    objectsWon: any;

    /**
     * A abstract model that represents the basic version of a challenge's state.
     * @param players - the players participating in this challenge
     * @param questions
     * @param initialState
     */
    constructor(
        public players: Player[],
        public questions: Question[],
        initialState: string = Challenge.CHALLENGE_STATES.IN_GAME
    ) {
        super(initialState);

        this.players = players;
        this.questions = questions;
        this.agreedPlayerNames = [];
        this.raisedHands = [];
        this.votedPlayers = {};
        this.isChallengeRunning = false;

        this.roles = this.getRoles(this.players.length);
    }

    get hasMajorityVoteForAgreedPlayers() {
        return this.agreedPlayerNames.length >= this.players.length / 2;
    }

    get raisedHandsAreValid() {
        for (let role of this.roles) {
            let raisedHandsOfRole = this.raisedHands.filter(
                (rh) => rh.roleName === role.name
            );
            if (raisedHandsOfRole.length !== role.numPlayers) {
                return false;
            }
        }
        return true;
    }

    get state() {
        return this._state;
    }

    set state(newState: string) {
        this._state = newState;

        switch (this.state) {
            case Challenge.CHALLENGE_STATES.IN_GAME:
                this.setRoles();
                break;
            case Challenge.CHALLENGE_STATES.CHALLENGE_END:
                this.isChallengeRunning = false;
                break;
            default:
                break;
        }
    }

    get pointsPerMinute() {
        return 0;
    }

    get intermissionText() {
        return "";
    }

    get simplifiedChallenge(): SimplifiedChallenge {
        return new SimplifiedChallenge(this);
    }

    addAgreedPlayer(playerName: string) {
        let foundPlayer = this.agreedPlayerNames.find(
            (name) => name === playerName
        );
        if (!foundPlayer) {
            this.agreedPlayerNames.push(playerName);
        }
    }

    raiseHandForPlayer(playerName: string, roleName: string) {
        let foundRaisedHand = this.raisedHands.find(
            (r) => r.playerName === playerName
        );

        if (foundRaisedHand) {
            let indexOfRaisedHand = this.raisedHands.indexOf(foundRaisedHand);
            this.raisedHands[indexOfRaisedHand].roleName = roleName;
        } else {
            this.raisedHands.push({ playerName, roleName });
        }

        this.agreedPlayerNames = [];
    }

    setVotedPlayer(playerName: string) {
        if (!this.votedPlayers[playerName]) {
            this.votedPlayers[playerName] = 1;
        } else {
            this.votedPlayers[playerName]++;
        }
    }

    removeVotedPlayer(playerName: string) {
        if (this.votedPlayers[playerName]) {
            this.votedPlayers[playerName]--;

            if (this.votedPlayers[playerName] <= 0) {
                delete this.votedPlayers[playerName];
            }
        }
    }

    getRoles(numPlayers: number): Role[] {
        return [];
    }

    setRoles() {
        if (!this.raisedHandsAreValid) {
            return;
        }

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].currentRoleName = null;
            let raisedHand = this.raisedHands.find(
                (rh) => rh.playerName === this.players[i].name
            );
            if (raisedHand) {
                this.players[i].currentRoleName = raisedHand.roleName;
            }
        }
    }

    moveNext() {
        switch (this.state) {
            case Challenge.CHALLENGE_STATES.ROLE_SELECTION:
                this.state = Challenge.CHALLENGE_STATES.IN_GAME;
                break;
            case Challenge.CHALLENGE_STATES.IN_GAME:
                this.state = Challenge.CHALLENGE_STATES.CHALLENGE_END;
                break;
            default:
                break;
        }
    }

    setChallengeIsRunning() {
        this.isChallengeRunning = true;
    }

    endChallenge() {
        this.state = Challenge.CHALLENGE_STATES.CHALLENGE_END;
    }

    updatePoints(points: number) {
        this.pointsWon += points;

        if (this.pointsWon < 0) {
            this.pointsWon = 0;
        }
    }

    addObjectsOfTypeWon(type: string, numObjects: number) {
        this.objectsWon[type] += numObjects;

        if (this.objectsWon[type] < 0) {
            this.objectsWon[type] = 0;
        }
    }
}
