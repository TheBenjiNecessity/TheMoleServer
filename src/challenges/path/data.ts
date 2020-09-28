import PathChallengeController from './controller';
import PathChallenge from './model';

export default {
	type: 'path',
	maxPlayers: 5,
	minPlayers: 5,
	initialState: 'walker',
	lang: {
		en: {
			title: 'The Path',
			description: '',
			questions: [
				{
					text: 'In "The Path" challenge, what position did the mole walk the path?',
					type: 'rank',
					choices: []
				},
				{
					text: 'In "The Path" challenge, did the mole make it to the end?',
					type: 'choices',
					choices: [ 'Yes', 'No' ]
				},
				{
					text: 'In "The Path" challenge, what reward or punishment did the mole take?',
					type: 'choices',
					choices: [ 'An exemption', 'A black exemption', 'A joker', 'Two jokers', 'negative points' ]
				}
			]
		}
	},
	getController: function() {
		return PathChallengeController.getInstance();
	},
	getModel: function(players, lang) {
		return new PathChallenge(
			players,
			this.lang[lang].title,
			this.lang[lang].description,
			this.maxPlayers,
			this.minPlayers,
			this.lang[lang].questions,
			this.initialState
		);
	}
};
