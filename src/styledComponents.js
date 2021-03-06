import styled from 'styled-components';
const colors = {
    'darkblue': '#37474f'
}


const AppContainer = styled.div`
    text-align: center;
    display: flex;
    flex-direction: column;
    height: 100vh;
`

const ButtonWrap = styled.section`
    display: flex;
    flex-direction: row; 
    justify-content: center;
`

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column; 
`

const Button = styled.button`
    background: ${props => props.disabled ? "#aaa" : colors['darkblue']};
    opacity: ${props => props.disabled ? .5 : 1};
    cursor: ${props => props.disabled ? 'auto' : 'pointer'};
    color: #fff;
    border-radius: 5px;
    display: block;
    margin: .4em;
    padding: 1em 2em;
    min-width: 200px;
`

const Header = styled.header`
    background: #ECEFF1;
    padding: 1rem 0;
`

const ButtonGroupTitle = styled.h2`
    color: #333;
    font-size: 3.1rem;
    margin: 0 0 .6rem 0;
`

const GridSection = styled.main`
    margin: auto 0;
`

const GridWrap = styled.div`
    display: inline-block;
    border: 1px solid #ccc;
    padding: 1rem;
    align-self: center;
`

const Grid = styled.div`
    display: grid;
    grid-template-rows: ${props => `repeat(${props.rowCount}, 1fr)`};
    grid-template-columns: ${props => `repeat(${props.columnCount}, 1fr)`};
    grid-gap: 0;
`

const CellWrap = styled.div`
    background-color: ${props => props.value ? "#000" : "#fff"};
    width: 20px;
    height: 20px;
`

const Automaton = styled.button`
    background-color: ${props => props.value ? "#000" : "#fff"};
    width: 20px;
    height: 20px;
    
    &:hover {
      background-color: red; 
    }
`

const FrameNumberSection = styled.div`
    display: flex;
    justify-content: center;
    background-color: ${colors['darkblue']};
    color: #fff;
`

const FrameNumber = styled.div`
    font-size: 20px;
    padding: 1rem 0;
`

const Dl = styled.dl`
    display: flex;
    width: 200px;
    justify-content: space-between;
`
const Dt = styled.dt`
    display: inline-block;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
`

const Dd = styled.dd`
    display: inline-block;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
`

export {
    AppContainer,
    ButtonWrap,
    ButtonGroup,
    Button,
    Header,
    ButtonGroupTitle,
    GridSection,
    GridWrap,
    Grid,
    CellWrap,
    Automaton,
    FrameNumberSection,
    FrameNumber,
    Dl,
    Dt,
    Dd
}