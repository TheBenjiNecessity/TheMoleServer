import ButtonChallengeData from './data';
import RoomSampleService from '../../models/samples/room.sample';
import PlatterChallenge from './model';

test('Checks initializing PlatterChallenge model', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new ButtonChallengeData().getModel(room.players, 'en') as PlatterChallenge;

	//expect(platterChallenge).toBe(true); // TODO num players?
});

test('Checks allMoneyWasTaken method', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new ButtonChallengeData().getModel(room.players, 'en') as PlatterChallenge;

	expect(platterChallenge.allMoneyWasTaken).toBe(false);

	for (let player of room.playersStillPlaying) {
		platterChallenge.playersWhoTookMoney.push(player);
	}

	expect(platterChallenge.allMoneyWasTaken).toBe(true);
});

test('Checks allButtonsReleased/allButtonsPressed getters', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new ButtonChallengeData().getModel(room.players, 'en') as PlatterChallenge;
	let player = room.playersStillPlaying[0];

	expect(platterChallenge.playerWhoTookExemption).toEqual(null);

	platterChallenge.takeExemption(room.playersStillPlaying[0].name);

	expect(platterChallenge.playerWhoTookExemption).toEqual(room.playersStillPlaying[0]);
});

test('Checks allButtonsReleased/allButtonsPressed getters', () => {
	let room = RoomSampleService.getTestRoomForNumPlayers(5);
	let platterChallenge = new ButtonChallengeData().getModel(room.players, 'en') as PlatterChallenge;
	let player = room.playersStillPlaying[0];

	expect(platterChallenge.playersWhoTookMoney.length).toBe(0);

	for (let player of room.playersStillPlaying) {
		platterChallenge.takeMoney(player.name);
	}

	expect(platterChallenge.playersWhoTookMoney.length).toBe(room.playersStillPlaying.length);
});
