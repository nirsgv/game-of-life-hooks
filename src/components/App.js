import React, { useReducer, useMemo } from 'react';
import reducer from '../reducer';
import * as helpers from '../helpers';
import {
    AppContainer, ButtonWrap, ButtonGroup, Button, Header, ButtonGroupTitle, GridSection, GridWrap, GridDiv, CellWrap,
    Automaton, FrameNumberSection, FrameNumber, Dl, Dt, Dd
} from './common';
import GlobalStyle from '../styles/globalStyle'
import NumericInput from 'react-numeric-input';
import numInputStyle from '../styles/numInputStyle';
import SvgSprite from './svgSprite';

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";


function App() {
    return (
        <>
        <GlobalStyle />
        <AppContainer>
            <Game/>
        </AppContainer>
        </>
    );
}

const intialGridSize = {
    rows: isMobile ? 10 : 20,
    columns: isMobile ? 10 : 20
}

const getInitialState = () => ({
    history: [{
        grid: helpers.newGolGrid(intialGridSize.rows, intialGridSize.columns)
    }],
    isAnimating: false,
    isReverseAnimating: false,
    intervalId: '',
    rows: intialGridSize.rows,
    columns: intialGridSize.columns,
    frameRate: 900,
    isMobileMenuOpen: false
});

function Game() {
    const [ state, dispatch ] = useReducer(reducer, getInitialState());
    const { history, isAnimating, isReverseAnimating, intervalId, rows, columns, frameRate, isMobileMenuOpen } = state;
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

    const setDimensions = (valueAsNumber, valueAsString, input) => {
        let value = valueAsNumber >=1 ? valueAsNumber : 1;

        input.dataset.dimension === 'columns'
            ? dispatch({type: 'SET_COLUMNS', payload: value})
            : dispatch({type: 'SET_ROWS', payload: value})
    };

    const toggleMobileMenu = () => dispatch({type: 'TOGGLE_MOBILE_MENU'});

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
                  isMobileMenuOpen={isMobileMenuOpen}
                  toggleMobileMenu={toggleMobileMenu}
        />
        <FrameNumberSection>

            <div>Game Of Life</div>

            <FrameNumber>
                <Dl primary>
                    <Dt>Frame:</Dt>
                    <Dd>{history.length}</Dd>

                </Dl>
            </FrameNumber>
            <MobileView>
                <SvgSprite clickHandler={toggleMobileMenu} name={isMobileMenuOpen ? 'TIMES' : 'HAMBURGER'}/>
            </MobileView>
        </FrameNumberSection>
        <GridSection>
            <Grid grid={history[history.length - 1].grid} flip={flip}/>
        </GridSection>
        </>
    )
}

function Controls({ randomize, clear, next, prev, reverse, animate, stopAnimate, isAnimating, reverseAnimate,
                    isReverseAnimating, stopReverseAnimate, hasHistory, rows, columns, setDimensions, frameRate,
                    setFrameRate, isMobileMenuOpen, toggleMobileMenu }) {


    return (
        <Header className={`controls ${isMobile ? isMobileMenuOpen ? 'opened' : 'closed' : ''} `}>

            <MobileView>
                <SvgSprite clickHandler={toggleMobileMenu} name={isMobileMenuOpen ? 'TIMES' : 'HAMBURGER'}/>
            </MobileView>
            <ButtonWrap>
                <ButtonGroup>
                    <ButtonGroupTitle>Animate</ButtonGroupTitle>
                    <Button type='button' onClick={!isAnimating ? animate : stopAnimate}
                                   disabled={isReverseAnimating}>{!isAnimating ? 'ANIMATE' : 'STOP'}</Button>
                    <Button type='button' onClick={!isReverseAnimating ? reverseAnimate : stopReverseAnimate}
                                   disabled={isAnimating || !hasHistory}>{!isReverseAnimating ? 'REVERSE-ANIMATE' : 'STOP'}</Button>
                    <Dl>
                        <Dt>
                            <label htmlFor="speedInput">Speed</label>
                        </Dt>
                        <Dd>
                            <input id='speedInput' type='range' value={frameRate} onChange={setFrameRate} min={helpers.frameRateProps.MIN}
                                   max={helpers.frameRateProps.MAX} step={helpers.frameRateProps.STEP} disabled={isAnimating || isReverseAnimating}/>
                        </Dd>
                    </Dl>

                </ButtonGroup>
                <ButtonGroup>
                    <ButtonGroupTitle>Iterate</ButtonGroupTitle>
                    <Button type='button' onClick={next}>NEXT</Button>
                    <Button type='button' onClick={prev} disabled={!hasHistory}>PREV</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <ButtonGroupTitle>Reset</ButtonGroupTitle>
                    <Button type='button' onClick={randomize}>RANDOMIZE</Button>
                    <Button type='button' onClick={clear}>CLEAR</Button>
                    <Button type='button' onClick={reverse}>NEGATE</Button>
                </ButtonGroup>
                <BrowserView>
                <ButtonGroup>
                    <ButtonGroupTitle>Grid</ButtonGroupTitle>
                    <Dl>
                        <Dt>
                            <label htmlFor="rowsInput">Rows</label>
                        </Dt>
                        <Dd>
                            <NumericInput
                                strict
                                id='rowsInput'
                                type='number'
                                max={100}
                                step={1}
                                value={rows}
                                onChange={setDimensions}
                                data-dimension='rows'
                                style={numInputStyle}
                            />
                        </Dd>
                    </Dl>
                    <Dl>
                        <Dt>
                            <label htmlFor="columnsInput">Columns</label>
                        </Dt>
                        <Dd>
                            <NumericInput
                                strict
                                id='columnsInput'
                                type='number'
                                max={100}
                                step={1}
                                value={columns}
                                onChange={setDimensions}
                                data-dimension='columns'
                                style={numInputStyle}
                            />
                        </Dd>
                    </Dl>
                </ButtonGroup>
                </BrowserView>
            </ButtonWrap>
        </Header>
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
        <GridWrap>
            <GridDiv rowCount={grid.length} columnCount={grid[0].length}>
                {MemoizedGrid}
            </GridDiv>
        </GridWrap>
    )
}

function Cell({value, flip, colIdx, rowIdx}) {
    return (
        <CellWrap>
            <Automaton type='button' value={value} onClick={flip} />
        </CellWrap>
    )
}

export default App;