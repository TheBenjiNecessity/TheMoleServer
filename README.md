## TODO
- Test whether it is necessary to reset room every time it is set
- Create a "riddle" model (question text (localized), answer (localized))
- When the timer on a challenge is over, the challenge should not 'end' but rather the challenge will 'move next'

## Future Challenges

Button = max: 4 / min: 4
Out and Safe = max: 10 / min: 5
Path = max: 5 / min: 5
Platter = max: 6 / min: 4
Stacks = max: 6 / min: 6
Traders = max: 6 / min: 6

- Train Stops 8-10:
    Players are seperated into teams of two or three and each team starts at a different train station. 
    Each station is located around a circular track. The task is for each player to end up at their correct
    station based on a series of clues in a logic puzzle. When the train comes into the station at least
    one player must switch with someone already on the train and the train can't be empty.

- Push your Luck 4 - 7 (Bigger board for more players, fewer flips for more players)
    Each player takes a turn flipping tiles on a board one at a time where the tiles have points printed on them.
    They can flip a maximum of five tiles and the last tile flipped is the points they make for their turn.
    When they flip a new tile, all other tiles are removed from the game and cannot be flipped by next players.

- Pass Along 8 - 10
    Starting with a random player, players must pass an object to each other player in turn based on a special sequence.

- Word Path 5 - 10
    Players nominate one other player to be the 'walker'. The walker is given a legend of words and what prize amounts those words are worth. The walker then starts at the center of a grid of random letters. The walker takes turns over and over until a word is spelled. At the beginning of each turn, he tells the others what direction he wants to walk in and then the others tell him how far to walk. If the walker lands on a desired letter then they can claim that letter and add it to the word. As soon as a word is spelled, the prize for that word is won. The time limit for this game is five minutes. If a word is not spelled before the end of five minutes then nothing is won. (Note: the walker is not allowed to tell the others what word is going for)

- Symbols 4 - 6
    Each player is given a set of symbols that they must describe to the other players. If a player sees that they have that symbol on their screen then they match it to the person describing it. Each set of symbols that are matched properly in this way wins the group X points.

- Word list memory 7 - 10
    One player is given a list of words that they must memorize. They then tell one other player the list of words, that player tells the next player, and so on until the last player memorizes the list. The last player then inputs the list and players win points for each word input correctly.

- Chest Run 5 - 7 players
    Each player takes a turn moving a chest through a course. Along the way, they can pick up money (plus or minus) and add it to the chest. Each player has a set time limit to move the chest as far as possible (1min). The course is a series of locked rooms where the player must solve a series of riddles/math problems to proceed (unlock doors to new rooms)

- Morse Code 8 - 10
    Each player is assigned another player but doesn't know who that player is. By only using morse code, they must figure out who they are talking to and who is talking to them (in a chain). If they can do this correctly in 5 minutes then they win. (After 5 minutes is up, they must enter the chain into the computer)

- Difuse a bomb

- different answers
    Everyone is asked a question at the same time that they must select an answer for. More than one answer is
    possible. If more than one person gives the same response then that answer is not counted. Answers that are counted give points for the pot.

- figure out a sentence
    The players nominate one player to be the speaker. It is the speakers job to enter words into a text box.
    With each word entered, a light will appear on the screen indicating which spot in a sentence that word will
    appear. Once the players figure out the sentence, it will guide them to the answer to a riddle that they must answer. If they can answer the riddle in time then they win.

- Flow Chart
    Players are presented with a complicated flow chart where if they deposit money at the top then it will trickle down to the bottom and potentially double or triple or even be halved or negative. They a set time limit to figure out which starting spot the money should be before it is sent down.

- Balconies
    The players are presented with a 5x5 grid of spaces where each space represents a balcony on the fascade of a hotel. Each player starts at a random location on this grid and players have 5 minutes to move around the hotel and figure out where each player must be standing (on the grid) by figuring out a series of clues. Each clue can only be seen if a player is standing on the balcony where the clue is located.

- See no evil, speak no evil, hear no evil - 6 players
    Players are separated into three roles (see, hear, and speak) and have 5 minutes to get a message across from one group to another. The see no evil players should position themselves so that they can't see the other players (turn their backs).
    (The speak no evil group are the starting group and they can't say anything during the challenge and must rely on charades)
    (The hear no evil group is in the middle and is watching the speak no evil group do charades)
    (The hear no evil group then must speak to the see no evil group about what the speak no evil group are charading)
    (The see no evil group then solves a riddle based on the clues given)
    (SpNE shown a riddle)
    (HNE shown nothing)
    (SNE shown an input)
    (Everyone can answer the riddle but the speak no evil people can't talk and only the see no evil can enter anything)

# Types of possible challenges
- Move through a course and try to get to the end
    Pick up money along the way
    Find rewards at different spots along the course

- Move a player or playing piece around a board (grid)

- Last player to do something

- Only responses that are unique are counted

- Solve riddles

- If everyone ends up in the right spot at the end of the challenge then money is won


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