import React, { useReducer, useMemo } from 'react';
import reducer from './reducer';
import * as helpers from './helpers';
import * as styled from './styledComponents';
import GlobalStyle from './globalStyle'

function App() {
    return (
        <>
        <GlobalStyle />
        <styled.AppContainer>
            <Game/>
        </styled.AppContainer>
        </>
    );
}

const getInitialState = () => ({
    history: [{
        grid: helpers.newGolGrid()
    }],
    isAnimating: false,
    isReverseAnimating: false,
    intervalId: '',
    rows: 30,
    columns: 30,
    frameRate: 900
});

function Game() {
    const [ state, dispatch ] = useReducer(reducer, getInitialState());
    const { history, isAnimating, isReverseAnimating, intervalId, rows, columns, frameRate } = state;
    const flip = ({colIdx, rowIdx}) => dispatch({type: 'FLIP', payload: {colIdx, rowIdx}});
    const randomize = () => dispatch({type: 'RANDOMIZE'});
    const clear = () => dispatch({type: 'CLEAR'});
    const next = () => dispatch({type: 'NEXT'});
    const prev = () => dispatch({type: 'PREV'});
    const reverse = () => dispatch({type: 'REVERSE'});

    const animate = () => {
        const intervalId = setInterval(() => {
            dispatch({type: 'NEXT'})
        }, helpers.getOppositeFramerate(helpers.frameRateProps,frameRate));
        dispatch({type: 'ANIMATE', payload: intervalId})
    };
    const stopAnimate = () => {
        clearInterval(intervalId);
        dispatch({type: 'STOP_ANIMATE'})
    };

    const reverseAnimate = () => {
        const intervalId = setInterval(() => {
            dispatch({type: 'PREV'})
        }, helpers.getOppositeFramerate(helpers.frameRateProps,frameRate));
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
        <>
        <styled.Header className='controls'>
            <Controls randomize={randomize}
                      clear={clear}
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
        </styled.Header>
        <styled.FrameNumberSection>
            <styled.FrameNumber>
                <styled.Dl>
                    <styled.Dt>Frame Number:</styled.Dt>
                    <styled.Dd>{history.length}</styled.Dd>
                </styled.Dl>
            </styled.FrameNumber>
        </styled.FrameNumberSection>
        <styled.GridSection>
            <Grid grid={history[history.length - 1].grid} flip={flip}/>
        </styled.GridSection>
        </>
    )
}

function Controls({ randomize, clear, next, prev, reverse, animate, stopAnimate, isAnimating, reverseAnimate, isReverseAnimating,
                      stopReverseAnimate, hasHistory, rows, columns, setDimensions, frameRate, setFrameRate }) {
    return (
        <styled.ButtonWrap>
            <styled.ButtonGroup>
                <styled.ButtonGroupTitle>Animate</styled.ButtonGroupTitle>
                <styled.Button type='button' onClick={!isAnimating ? animate : stopAnimate}
                               disabled={isReverseAnimating}>{!isAnimating ? 'ANIMATE' : 'STOP'}</styled.Button>
                <styled.Button type='button' onClick={!isReverseAnimating ? reverseAnimate : stopReverseAnimate}
                               disabled={isAnimating || !hasHistory}>{!isReverseAnimating ? 'REVERSE-ANIMATE' : 'STOP'}</styled.Button>
                <styled.Dl>
                    <styled.Dt>
                        <label htmlFor="speedInput">Speed</label>
                    </styled.Dt>
                    <styled.Dd>
                        <input id='speedInput' type='range' value={frameRate} onChange={setFrameRate} min={helpers.frameRateProps.MIN}
                               max={helpers.frameRateProps.MAX} step={helpers.frameRateProps.STEP} disabled={isAnimating || isReverseAnimating}/>
                    </styled.Dd>
                </styled.Dl>

            </styled.ButtonGroup>
            <styled.ButtonGroup>
                <styled.ButtonGroupTitle>Iterate</styled.ButtonGroupTitle>
                <styled.Button type='button' onClick={next}>NEXT</styled.Button>
                <styled.Button type='button' onClick={prev} disabled={!hasHistory}>PREV</styled.Button>
            </styled.ButtonGroup>
            <styled.ButtonGroup>
                <styled.ButtonGroupTitle>Reset</styled.ButtonGroupTitle>
                <styled.Button type='button' onClick={randomize}>RANDOMIZE</styled.Button>
                <styled.Button type='button' onClick={clear}>CLEAR</styled.Button>
                <styled.Button type='button' onClick={reverse}>NEGATE</styled.Button>
            </styled.ButtonGroup>
            <styled.ButtonGroup>
                <styled.ButtonGroupTitle>Grid</styled.ButtonGroupTitle>
                <styled.Dl>
                    <styled.Dt>
                        <label htmlFor="rowsInput">Rows</label>
                    </styled.Dt>
                    <styled.Dd>
                        <input id='rowsInput' type='number' max={100} step={1} value={rows} onChange={setDimensions} data-dimension='rows'/>
                    </styled.Dd>
                </styled.Dl>
                <styled.Dl>
                    <styled.Dt>
                        <label htmlFor="columnsInput">Columns</label>
                    </styled.Dt>
                    <styled.Dd>
                        <input id='columnsInput' type='number' max={100} step={1} value={columns} onChange={setDimensions} data-dimension='columns'/>
                    </styled.Dd>
                </styled.Dl>
            </styled.ButtonGroup>
        </styled.ButtonWrap>
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
        <styled.GridWrap>
            <styled.Grid rowCount={grid.length} columnCount={grid[0].length}>
                {MemoizedGrid}
            </styled.Grid>
        </styled.GridWrap>
    )
}

function Cell({value, flip}) {
    return (
        <styled.CellWrap>
            <styled.Automaton type='button' value={value} onClick={flip} />
        </styled.CellWrap>
    )
}

export default App;