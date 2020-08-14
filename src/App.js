import React, {useReducer, useMemo} from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <Game/>
        </div>
    );
}

function generateGrid(rows = 30, columns = 30, mapper) {
    return Array(rows)
        .fill()
        .map(() => Array(columns)
            .fill()
            .map(mapper))
}

const newGolGrid = (rows, columns) => generateGrid(rows, columns, () => Boolean(Math.floor(Math.random() * 2)));
const deepClone = x => JSON.parse(JSON.stringify(x));
const getInitialState = () => ({
    history: [{
        grid: newGolGrid()
    }],
    isAnimating: false,
    isReverseAnimating: false,
    intervalId: '',
    rows: 30,
    columns: 30,
    frameRate: 900
});

const countActiveNeighbours = (rowIdx, colIdx, indexedGrid) => {
    let count = 0;
    indexedGrid[`row${rowIdx - 1}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx - 1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx - 1}col${colIdx + 1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx}col${colIdx + 1}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx - 1}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx}`] && count++;
    indexedGrid[`row${rowIdx + 1}col${colIdx + 1}`] && count++;
    return count;
};

const frameRateProps = {MIN: 50, MAX: 1000, STEP: 10};

const getOppositeFramerate = (frameRateProps, input) => {
    const { MIN, MAX } = frameRateProps;
    const range = MIN + MAX;
    const oppositeOutput = range - Number(input);
    return oppositeOutput;
}
const reducer = (state, action) => {

    switch (action.type) {

        case 'RESET': {
            return {
                ...state,
                history: [{
                    grid: newGolGrid()
                }]
            }
        }

        case 'REVERSE': {
            const currentGrid = state.history[state.history.length - 1].grid,
                  reversedGrid = currentGrid.map(row => row.map(value => !value));
            return {...state, history: state.history.concat({grid: reversedGrid})}
        }

        case 'NEXT': {
            const currentGrid = state.history[state.history.length - 1].grid,
                  indexedGrid = {};
            for (let i = 0; i < currentGrid.length; i++) {
                for (let j = 0; j < currentGrid[i].length; j++) {
                    indexedGrid[`row${i}col${j}`] = currentGrid[i][j];
                }
            }
            const nextGrid = currentGrid.map((row, rowIdx) => row.map(
                (value, colIdx) => {
                    const activeNeighbours = countActiveNeighbours(rowIdx, colIdx, indexedGrid);
                    return (value
                        ? activeNeighbours === 2 || activeNeighbours === 3 // initially alive cell
                        : activeNeighbours === 3) // initially dead cell
                }));
            return {...state, history: state.history.concat({grid: nextGrid})}
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
            const currentGrid = state.history[state.history.length - 1].grid,
                  nextState = deepClone(currentGrid),
                  {colIdx, rowIdx} = action.payload,
                  cellValue = nextState[rowIdx][colIdx];
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

        case 'SET_ROWS': {
            return {
                ...state,
                rows: action.payload,
                history: [{
                    grid: newGolGrid(action.payload, state.columns)
                }]
            }
        }

        case 'SET_COLUMNS': {
            return {
                ...state,
                columns: action.payload,
                history: [{
                    grid: newGolGrid(state.rows, action.payload)
                }]
            }
        }

        case 'SET_FRAME_RATE': {
            return {
                ...state,
                frameRate: action.payload
            }
        }
        default:
            return state;
    }
};



function Controls({ reset, next, prev, reverse, animate, stopAnimate, isAnimating, reverseAnimate, isReverseAnimating,
                    stopReverseAnimate, hasHistory, rows, columns, setDimensions, frameRate, setFrameRate }) {


    return (
        <div>
            <button type='button' onClick={reset}>RESET</button>
            <button type='button' onClick={reverse}>REVERSE</button>
            <button type='button' onClick={next}>NEXT</button>
            <button type='button' onClick={prev} disabled={!hasHistory}>PREV</button>
            <button type='button' onClick={!isAnimating ? animate : stopAnimate}
                    disabled={isReverseAnimating}>{!isAnimating ? 'ANIMATE' : 'STOP ANIMATE'}</button>
            <button type='button' onClick={!isReverseAnimating ? reverseAnimate : stopReverseAnimate}
                    disabled={isAnimating}>{!isReverseAnimating ? 'REVERSE-ANIMATE' : 'STOP-REVERSE-ANIMATE'}</button>
            <input type='number' value={rows} onChange={setDimensions} data-dimension='rows'/>
            <input type='number' value={columns} onChange={setDimensions} data-dimension='columns'/>
            <input type='range' value={frameRate} onChange={setFrameRate} min={frameRateProps.MIN}
                   max={frameRateProps.MAX} step={frameRateProps.STEP} disabled={isAnimating || isReverseAnimating}/>
        </div>
    )
}

function Game() {
    const [ state, dispatch ] = useReducer(reducer, getInitialState());
    const { history, isAnimating, isReverseAnimating, intervalId, rows, columns, frameRate } = state;
    const flip = ({colIdx, rowIdx}) => dispatch({type: 'FLIP', payload: {colIdx, rowIdx}});
    const reset = () => dispatch({type: 'RESET'});
    const next = () => dispatch({type: 'NEXT'});
    const prev = () => dispatch({type: 'PREV'});
    const reverse = () => dispatch({type: 'REVERSE'});

    const animate = () => {
        const intervalId = setInterval(() => {
            dispatch({type: 'NEXT'})
        }, getOppositeFramerate(frameRateProps,frameRate));
        dispatch({type: 'ANIMATE', payload: intervalId})
    };
    const stopAnimate = () => {
        clearInterval(intervalId);
        dispatch({type: 'STOP_ANIMATE'})
    };

    const reverseAnimate = () => {
        const intervalId = setInterval(() => {
            dispatch({type: 'PREV'})
        }, getOppositeFramerate(frameRateProps,frameRate));
        dispatch({type: 'REVERSE_ANIMATE', payload: intervalId})
    };

    const stopReverseAnimate = () => {
        clearInterval(intervalId);
        dispatch({type: 'STOP_REVERSE_ANIMATE'})
    };

    const setDimensions = (e) => {
        let value = e.target.value ? Number(e.target.value) : 1;
        e.target.dataset.dimension === 'columns'
            ? dispatch({type: 'SET_COLUMNS', payload: value})
            : dispatch({type: 'SET_ROWS', payload: value})
    };

    const setFrameRate = (e) => {
        dispatch({type: 'SET_FRAME_RATE', payload: Number(e.target.value)});
        if (isAnimating){
            stopAnimate();
            animate()
        } else if (isReverseAnimating){
            stopReverseAnimate();
            reverseAnimate()
        }
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
                      setDimensions={setDimensions}
                      setFrameRate={setFrameRate}
                      isAnimating={isAnimating}
                      isReverseAnimating={isReverseAnimating}
                      hasHistory={history.length > 1}
                      rows={rows}
                      columns={columns}
                      frameRate={frameRate}
            />
            <div>{history.length}</div>
            <Grid grid={history[history.length - 1].grid} flip={flip}/>
        </div>
    )
}

function Grid({grid, flip}) {
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
            <div style={{
                display: 'grid',
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

function Cell({value, flip}) {
    return (
        <div style={{
            backgroundColor: value ? '#000' : '#fff',
            width: 20,
            height: 20,
        }}>
            <button type='button'
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: value ? '#000' : '#fff'
                    }}
                    onClick={flip}
            >
            </button>
        </div>
    )
}

export default App;