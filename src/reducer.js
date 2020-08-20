import * as helpers from './helpers'

const reducer = (state, action) => {

    switch (action.type) {

        case 'RANDOMIZE': {
            return {
                ...state,
                history: [{
                    grid: helpers.newGolGrid(state.rows, state.columns, () => Boolean(Math.floor(Math.random() * 2)))
                }]
            }
        }

        case 'CLEAR': {
            return {
                ...state,
                history: [{
                    grid: helpers.newGolGrid(state.rows, state.columns, () => false)
                }]
            }
        }

        case 'REVERSE': {
            const currentGrid = state.history[state.history.length - 1].grid,
                reversedGrid = currentGrid.map(row => row.map(value => !value));
            return {...state, history: [{grid: reversedGrid}]}
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
                    const activeNeighbours = helpers.countActiveNeighbours(rowIdx, colIdx, indexedGrid);
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
                nextState = helpers.deepClone(currentGrid),
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
                    grid: helpers.newGolGrid(action.payload, state.columns)
                }]
            }
        }

        case 'SET_COLUMNS': {
            return {
                ...state,
                columns: action.payload,
                history: [{
                    grid: helpers.newGolGrid(state.rows, action.payload)
                }]
            }
        }

        case 'SET_FRAME_RATE': {
            return {
                ...state,
                frameRate: action.payload
            }
        }

        case 'TOGGLE_MOBILE_MENU': {
            return {
                ...state,
                isMobileMenuOpen: !state.isMobileMenuOpen
            }
        }
        default:
            return state;
    }
};

export default reducer;