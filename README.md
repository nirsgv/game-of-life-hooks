Please try the [Deployed App](https://frozen-castle-59910.herokuapp.com/).\
Conway's Game of Life is a [Cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) (amazing) [zero-player game](https://en.wikipedia.org/wiki/Zero-player_game).\
In this game - every step is a direct deterministic output of the previous step.

The game rules:
<ol>
<li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
<li>Any live cell with two or three live neighbours lives on to the next generation</li>
<li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
</ol>

Developed using react with hooks (notably useReducer for state management).
My favorite feature - 'time-traveling' (try the 'REVERSE-ANIMATE' button).
