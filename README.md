## TODO
- Test whether it is necessary to reset room every time it is set
- Add integration tests

## Future Challenges

- Train Stops 8-10:
    Players are seperated into teams of two or three and each team starts at a different train station. 
    Each station is located around a circular track. The task is for each player to end up at their correct
    station based on a series of clues in a logic puzzle. When the train comes into the station at least
    one player must switch with someone already on the train and the train can't be empty.


/**
 * STATE
 * 		page: what shows on the page
 * 		action: what does the page do in the background
 * 		move next: how does this page move onto the next page (below)
 * LOBBY
 * 		page: options to host room or enter player information
 * 		actions: none
 * 		move next: player clicks to be "host" or adds player name and roomcode and clicks "play"
 * WELCOME
 * 		page: text describing overview of game
 * 		actions: room is set to "in progress", mole is chosen for the room
 * 		move next: one player in the room clicks "start" (start button not clickable until mole is chosen)
 * EPISODE_START
 * 		page: text describing how many players there are and what happened in the previous episode
 * 		actions: episode is created and first challenge is selected
 * 		move next: one player in the room clicks "start"
 * IN_CHALLENGE
 * 		page:
 * 			If challenge has a role page then show role selection.
 * 			After role selection, or if challenge doesn't have roles, show challenge pages.
 * 			All challenges are different and pages are determined by challenges' internal state
 * 		actions: each challenge is different
 * 		move next:
 * 			Success or failure conditions have been met for the challenge and the challenge
 * 			progesses the room to the next room state internally
 * CHALLENGE_INTERMISSION
 * 		page: shows whether the challenge was successful or not
 * 		actions: sets up the next challenge in the episode
 * 		move next: one player in the room clicks "start"
 * 			checks if there are any more challenges in the episode and if yes then go to IN_CHALLENGE state
 * 			if not then go to the PRE_QUIZ_INTERMISSION state
 * PRE_QUIZ_INTERMISSION
 * 		page: shows a message to the players that they are about to do the quiz.
 * 		actions: none (quiz already prepared when episode was created)
 * 		move next: one player in the room clicks "start"
 * IN_QUIZ
 * 		page: shows a screen showing whether or not all players have finished their quiz
 * 		action: none
 * 		move next: when all players have finished their quiz
 * POST_QUIZ_INTERMISSION
 * 		page: text showing that all players have finished their quiz as well as if jokers or exemptions were played.
 * 		action: none
 * 		move next: one player in the room clicks "start"
 * EXECUTION
 * 		page: a text box for player name input. Shows a green or red screen based on player elimination
 * 		action: 
 * 			selects a player at random and types that player's name into the text box. Then shows a green or red
 * 			screen based on if they were eliminated.
 * 		move next: as soon as the eliminated player is revealed
 * EXECUTION_WRAPUP
 * 		page: text showing who was eliminated and that they will be missed
 * 		action: none
 * 		move next: one player in the room clicks "start"
 * EPISODE_START...
 * TODO: what about final episode/mole reveal?
 */