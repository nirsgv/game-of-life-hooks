import styled from 'styled-components';

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
    background: ${props => props.disabled ? "#aaa" : "#37474f"};
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
    font-size: 1rem;
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

const Automaton = styled.div`
    background-color: ${props => props.value ? "#000" : "#fff"};
    width: 20px;
    height: 20px;
    
    &:hover {
      background-color: red; 
    }
`

const FrameNumberSection = styled.div`
    border-bottom: 1px solid #ddd;
    background-color: #37474f;
    color: #fff;
`

const FrameNumber = styled.div`
    font-size: 20px;
    padding: 1rem 0;
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
    FrameNumber
}