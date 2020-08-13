import React, { useReducer, useMemo } from 'react';
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
const newGolGrid = () => generateGrid(30, 30, () => Boolean(Math.floor(Math.random() * 2)));
const deepClone = x => JSON.parse(JSON.stringify(x));
const getInitialState = () => ({
    history: [{
        grid: newGolGrid()
    }],
    isAnimating: false,
    isReverseAnimating: false,
    intervalId: ''
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
            return {
                ...state,
                history: [{
                    grid: newGolGrid()
                }]}
        }

        case 'REVERSE': {
            const currentGrid = state.history[state.history.length-1].grid;
            const reversedGrid = currentGrid.map(row => row.map(value => !value));
            return { ...state, history: state.history.concat({grid: reversedGrid}) }
        }

        case 'NEXT': {
            const currentGrid = state.history[state.history.length-1].grid;
            const indexedGrid = {};
            for (let i = 0; i < currentGrid.length; i++){
                for (let j = 0; j < currentGrid[i].length; j++){
                    indexedGrid[`row${i}col${j}`] = currentGrid[i][j];
                }
            }
            const nextGrid = currentGrid.map((row, rowIdx) => row.map(
                (value, colIdx) => {
                    const activeNeighbours = countActiveNeighbours(rowIdx, colIdx, indexedGrid);
                    return(value
                        ? activeNeighbours === 2 || activeNeighbours === 3 // initially alive cell
                        : activeNeighbours === 3) // initially dead cell
                }));
            return { ...state, history: state.history.concat({grid: nextGrid}) }
        }

        case 'PREV': {
            if (state.history.length !== 1) {
                return {
                ...state,
                history: state.history.slice(0, -1)
                }
            } else {
                clearInterval(state.intervalId);
                return {
                    ...state,
                    isReverseAnimating: false,
                    intervalId: ''
                }
            }
        }

        case 'FLIP': {
            const currentGrid = state.history[state.history.length-1].grid;
            const nextState = deepClone(currentGrid);
            const { colIdx, rowIdx } = action.payload;
            const cellValue = nextState[rowIdx][colIdx];
            nextState[rowIdx][colIdx] = !cellValue;
            return {
                ...state,
                history: state.history.concat({grid: nextState})
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
        case 'REVERSE_ANIMATE': {
            return {
                ...state,
                isReverseAnimating: true,
                intervalId: action.payload
            }
        }

        case 'STOP_REVERSE_ANIMATE': {
            return {
                ...state,
                isReverseAnimating: false,
                intervalId: ''
            }
        }
        default:
            return state;
    }
};

function Controls ({reset, next, prev, reverse, animate, stopAnimate, isAnimating,
                    reverseAnimate, isReverseAnimating, stopReverseAnimate, hasHistory}) {
    return (
        <div>
            <button type='button' onClick={reset}>RESET</button>
            <button type='button' onClick={reverse}>REVERSE</button>
            <button type='button' onClick={next}>NEXT</button>
            <button type='button' onClick={prev} disabled={!hasHistory}>PREV</button>
            <button type='button' onClick={!isAnimating ? animate : stopAnimate} disabled={isReverseAnimating}>{!isAnimating ? 'ANIMATE' : 'STOP ANIMATE'}</button>
            <button type='button' onClick={!isReverseAnimating ? reverseAnimate : stopReverseAnimate} disabled={isAnimating}>{!isReverseAnimating ? 'REVERSE-ANIMATE' : 'STOP-REVERSE-ANIMATE'}</button>
        </div>
        )
}

function Game () {
    const [state, dispatch] = useReducer(
        reducer,
        getInitialState()
    );
    const { history, isAnimating, isReverseAnimating, intervalId } = state;

    const flip = ({colIdx, rowIdx}) => {dispatch({ type: 'FLIP', payload: {colIdx, rowIdx} })};
    const reset = () => {dispatch({ type: 'RESET' })};
    const next = () => {dispatch({ type: 'NEXT' })};
    const prev = () => {dispatch({ type: 'PREV' })};
    const reverse = () => {dispatch({ type: 'REVERSE' })};
    const animate = () => {
        const intervalId = setInterval(() => {dispatch({ type: 'NEXT'})}, 100);
        dispatch({ type: 'ANIMATE', payload: intervalId })
    };
    const stopAnimate = () => {
        clearInterval(intervalId);
        dispatch({ type: 'STOP_ANIMATE' })
    };

    const reverseAnimate = () => {
        const intervalId = setInterval(() => {dispatch({ type: 'PREV'})}, 100);
        dispatch({ type: 'REVERSE_ANIMATE', payload: intervalId })
    };

    const stopReverseAnimate = () => {
        clearInterval(intervalId);
        dispatch({ type: 'STOP_REVERSE_ANIMATE' })
    };


    return (
        <div>
            <Controls reset={reset}
                      next={next}
                      prev={prev}
                      reverse={reverse}
                      animate={animate}
                      stopAnimate={stopAnimate}
                      reverseAnimate={reverseAnimate}
                      stopReverseAnimate={stopReverseAnimate}
                      isAnimating={isAnimating}
                      isReverseAnimating={isReverseAnimating}
                      hasHistory={history.length > 1}
            />
            <div>{history.length}</div>
            <Grid grid={history[history.length-1].grid} flip={flip}/>
        </div>
    )
}

function Grid ({ grid, flip }) {
    const MemoizedGrid = useMemo(
        () =>
            grid.map((row, rowIdx) => row.map(
                (value, colIdx) => (
                    <Cell key={`${colIdx}-${rowIdx}`}
                          value={value}
                          flip={() => flip({colIdx, rowIdx})}
                    />
                ))),
        [grid]
    );

  return (
      <div style={{display: 'inline-block'}}>
        <div style={{display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          backgroundColor: '#444',
          gridGap: 0
        }}>
          {MemoizedGrid}
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