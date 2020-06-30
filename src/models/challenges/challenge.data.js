export default {
	platter: {
		title: 'The Platter',
		description: '',
		maxPlayers: 6,
		minPlayers: 4,
		initialState: 'game',
		questions: [
			{
				text: 'In the "Platter" challenge, did the mole take the exemption?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			},
			{
				text: 'In the "Platter" challenge, in what position did the mole take points?',
				type: 'rank',
				choices: [ 'The mole did not take points' ]
			}
		]
	},
	'out-and-safe': {
		title: 'Out/Safe',
		description: '',
		maxPlayers: 10,
		minPlayers: 5,
		initialState: 'game',
		questions: [
			{
				text: 'During the "Out and Safe" challenge, did the mole play an out card?',
				type: 'boolean',
				choices: [ 'Yes', 'No' ]
			}
		]
	},
	'mole-talk': {
		title: 'Mole Talk',
		description: '',
		maxPlayers: 5,
		minPlayers: 5,
		initialState: 'game',
		questions: [
			{
				text: 'In the "Mole Talk" challenge, what position did the mole ask questions?',
				type: 'rank',
				choices: []
			}
		]
	},
	path: {
		title: 'The Path',
		description: '',
		maxPlayers: 5,
		minPlayers: 5,
		initialState: 'game',
		questions: [
			{
				text: 'In "The Path" challenge, what position did the mole walk the path?',
				type: 'rank',
				choices: []
			},
			{
				text: 'In "The Path" challenge, did the mole make it to the end?',
				type: 'boolean',
				choices: []
			},
			{
				text: 'In "The Path" challenge, what reward or punishment did the mole take?',
				type: 'choices',
				choices: [ 'An exemption', 'A black exemption', 'A joker', 'Two jokers', 'negative points' ]
			}
		]
	},
	'push-your-luck': {
		title: 'Push Your Luck',
		description: '',
		maxPlayers: 5,
		minPlayers: 5,
		initialState: 'game',
		questions: [
			{
				text: 'how many points did the mole make?',
				type: 'choices',
				choices: [ '0 - 3', '4 - 6', '7 - 10', '10+' ]
			},
			{
				text: 'what position did the mole take their turn?',
				type: 'rank',
				choices: []
			}
		]
	},
	stacks: {
		title: 'Stacks',
		description: '',
		maxPlayers: 6,
		minPlayers: 6,
		initialState: 'game',
		questions: [
			{
				text: "what was the amount of points on the mole's stack?",
				type: 'choices',
				choices: [ '-5', '-3', '-1', '1', '3', '5' ]
			}
		]
	},
	traders: {
		title: 'Traders',
		description: '',
		maxPlayers: 6,
		minPlayers: 6,
		initialState: 'game',
		questions: [
			{
				text: 'what reward did the mole end up with?',
				type: 'choices',
				choices: [ 'An exemption', 'A joker', 'Two jokers', 'Three jokers', 'Money', 'Nothing' ]
			},
			{
				text: 'what reward did the mole start with?',
				type: 'choices',
				choices: [ 'An exemption', 'A joker', 'Two jokers', 'Three jokers', 'Money', 'Nothing' ]
			}
		]
	},
	button: {
		title: 'The Button',
		description: '',
		maxPlayers: 4,
		minPlayers: 4,
		initialState: 'game',
		questions: [
			{
				text: 'did the mole take the exemption?',
				type: 'boolean'
			}
		]
	}
};
