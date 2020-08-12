import React, { useReducer } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}
function generateGrid(rows, columns, mapper) {
    return Array(rows)
        .fill()
        .map(() => Array(columns)
            .fill()
            .map(mapper))
}
const newGolGrid = () => generateGrid(50, 50, () => Boolean(Math.floor(Math.random() * 2)));
const deepClone = x => JSON.parse(JSON.stringify(x));
const getInitialState = () => ({grid: newGolGrid(), isAnimating: false, intervalId: ''});

const countActiveNeighbours = (rowIdx, colIdx, indexedGrid) => {
    let count = 0;
    indexedGrid[`row${rowIdx-1}col${colIdx-1}`] && count++;
    indexedGrid[`row${rowIdx-1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx-1}col${colIdx+1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx-1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx+1}`] && count++;
    indexedGrid[`row${rowIdx+1}col${colIdx-1}`] && count++;
    indexedGrid[`row${rowIdx+1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx+1}col${colIdx+1}`] && count++;
    return count;
};

const reducer = (state, action) => {

    switch (action.type) {

        case 'RESET': {
            return getInitialState()
        }

        case 'REVERSE': {
            const grid = state.grid.map(row => row.map(value => !value));
            return { grid }
        }

        case 'NEXT': {
            const indexedGrid = {};
            for (let i = 0; i < state.grid.length; i++){
                for (let j = 0; j < state.grid[i].length; j++){
                    indexedGrid[`row${i}col${j}`] = state.grid[i][j];
                }
            }
            const grid = state.grid.map((row, rowIdx) => row.map(
                (value, colIdx) => {
                    const activeNeighbours = countActiveNeighbours(rowIdx, colIdx, indexedGrid);
                    return(value
                        ? activeNeighbours === 2 || activeNeighbours === 3 // initially alive cell
                        : activeNeighbours === 3) // initially dead cell
                }));
            return { ...state, grid }
        }

        case 'FLIP': {
            const nextState = deepClone(state);
            const { colIdx, rowIdx } = action.payload;
            const cellValue = nextState.grid[rowIdx][colIdx];
            nextState.grid[rowIdx][colIdx] = !cellValue;

            return {
                ...nextState
            }
        }

        case 'ANIMATE': {

            return {
                ...state,
                isAnimating: true,
                intervalId: action.payload
            }
        }

        case 'STOP_ANIMATE': {

            return {
                ...state,
                isAnimating: false,
                intervalId: ''
            }
        }

        default:
            return state;
    }
};


function Game () {

    const reset = () => {dispatch({ type: 'RESET' })};
    const next = () => {dispatch({ type: 'NEXT'})};
    const flip = ({colIdx, rowIdx}) => {dispatch({ type: 'FLIP', payload: {colIdx, rowIdx} })};
    const reverse = () => {dispatch({ type: 'REVERSE' })};
    const animate = () => {
        const intervalId = setInterval(() => {dispatch({ type: 'NEXT'})}, 100);
        dispatch({ type: 'ANIMATE', payload: intervalId })
    };
    const stopAnimate = (intervalId) => {
        clearInterval(intervalId);
        dispatch({ type: 'STOP_ANIMATE' })
    };

    const [state, dispatch] = useReducer(
        reducer,
        getInitialState()
    );
    const { grid, isAnimating, intervalId } = state;
    return (
        <div>
            <button type='button' onClick={reset}>RESET</button>
            <button type='button' onClick={reverse}>REVERSE</button>
            <button type='button' onClick={next}>NEXT</button>
            <button type='button' onClick={!isAnimating ? animate : () => stopAnimate(intervalId)}>{!isAnimating ? 'ANIMATE' : 'STOP ANIMATE'}</button>
            <Grid grid={grid} flip={flip}/>
        </div>
    )
}

function Grid ({ grid, flip }) {
  return (
      <div style={{display: 'inline-block'}}>
        <div style={{display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          backgroundColor: '#444',
          gridGap: 0
        }}>
          {grid.map((row, rowIdx) => row.map(
              (value, colIdx) => (
                  <Cell key={`${colIdx}-${rowIdx}`}
                        value={value}
                        flip={() => flip({colIdx, rowIdx})}
                  />
              )))}
        </div>
      </div>
  )
}

function Cell ({ value, flip }) {
  return (
      <div style={{
        backgroundColor: value ? '#000' : '#fff',
        width: 20,
        height: 20,
      }}>
        <button type='button'
                style={{width: '100%',
                    height: '100%',
                    backgroundColor: value ? '#000' : '#fff'}}
                onClick={flip}
        >
        </button>
      </div>
  )
}

export default App;