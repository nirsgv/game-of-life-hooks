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
const newGolGrid = () => generateGrid(20, 20, () => Boolean(Math.floor(Math.random() * 2)));
const deepClone = x => JSON.parse(JSON.stringify(x));

const getInitialState = () => ({
    grid: newGolGrid(),
});

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

        case 'NEXT': {

            const indexedGrid = {};
            for (let i = 0; i < action.payload.length; i++){
                for (let j = 0; j < action.payload[i].length; j++){
                    indexedGrid[`row${i}col${j}`] = action.payload[i][j];
                }
            }
            const grid = action.payload.map((row, rowIdx) => row.map(
                (value, colIdx) => {
                    const activeNeighbours = countActiveNeighbours(rowIdx, colIdx, indexedGrid);
                    return(value
                        ? activeNeighbours === 2 || activeNeighbours === 3 // initially alive cell
                        : activeNeighbours === 3) // initially dead cell
                }));
            return { grid }
        }

        case 'FLIP': {
            console.log(1);

            const nextState = deepClone(state);
            const { colIdx, rowIdx } = action.payload;
            const cellValue = nextState.grid[rowIdx][colIdx];
            nextState.grid[rowIdx][colIdx] = !cellValue;

            return {
                ...nextState
            }
        }

        default:
            return state;
    }
};


function Game () {



    const reset = () => {
        dispatch({ type: 'RESET' })
    };

    const next = (grid) => {
        dispatch({ type: 'NEXT', payload: grid })
    };

    const flip = ({colIdx, rowIdx}) => {
        console.log(colIdx, rowIdx);
        dispatch({ type: 'FLIP', payload: {colIdx, rowIdx} })
    };

    const [state, dispatch] = useReducer(
        reducer,
        getInitialState()
    );
    const { grid } = state;
    return (
        <div>
            <button type='button' onClick={reset}>RESET</button>
            <button type='button' onClick={() => next(grid)}>NEXT</button>
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
          gridGap: 2
        }}>
          {grid.map((row, rowIdx) => row.map(
              (value, colIdx) => (
                  <Cell key={`${colIdx}-${rowIdx}`}
                        colIdx={colIdx}
                        rowIdx={rowIdx}
                        value={value}
                        flip={flip}
                  />
              )))}
        </div>
      </div>
  )
}

function Cell ({ value, colIdx, rowIdx, flip }) {
  return (
      <div style={{
        backgroundColor: value ? '#000' : '#fff',
        width: 30,
        height: 30,
      }}>
        <button type='button'
                style={{width: '100%',
                    height: '100%',
                    backgroundColor: value ? '#000' : '#fff'}
                }
                onClick={() => flip({colIdx, rowIdx})}
        >
        </button>
      </div>
  )
}

export default App;
