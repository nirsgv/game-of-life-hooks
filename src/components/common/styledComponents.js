import styled, {css} from 'styled-components';

const colors = {
    'darkblue': '#37474f'
}

const AppContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: column;
    text-align: center;
    height: 100vh;
`

const ButtonWrap = styled.section`
    display: flex;
    justify-content: center;
    
    flex-direction: column; 
    padding: 0 2rem;
    @media (hover: hover) {
    max-width: 120rem;
    padding: 0;
    flex-direction: row; 
    margin: 0 auto;
  }
`

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column; 
    //padding: 0.5rem;
    width: 100%;
    @media (hover: hover) {
      width: 25%;
    }
    
    & > * {
        margin: 0.4rem;

    }
`

const Button = styled.button`
    //min-width: 5rem;
    border-radius: 5px;
    color: #fff;
    opacity: ${props => props.disabled ? .5 : 1};
    background: ${props => props.disabled ? "#aaa" : colors['darkblue']};
    padding: .4em .8em;

  
    @media (hover: hover) {
      cursor: ${props => props.disabled ? 'auto' : 'pointer'};
      display: block;
      padding: 1em 2em;
      //min-width: 20rem;
  }
`

const Header = styled.header`
    background: #ECEFF1;
    position: absolute;
    height: 100vh;
    right: -50vw;
    width: 50vw;
    transition: right 0.1s ease-in;
    max-height: 100vh;
    &.opened {
      right: 0;
    }
    
    
    @media (hover: hover) {
      width: auto;
      height: auto;
      right: auto;
      padding: 1rem 0;
      position: relative;
      min-width: 20rem;
    }
    

`

const ButtonGroupTitle = styled.h2`
    color: #333;
    font-size: 3.1rem;
    margin: 0 0 .6rem 0;
`

const GridSection = styled.main`
    margin: auto 0;
    max-width: 100vw;
    overflow: hidden;
`

const GridWrap = styled.div`
    display: inline-block;
    border: 1px solid #ccc;
    padding: 1rem;
    align-self: center;
`

const GridDiv = styled.div`
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

const FrameNumberSection = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${colors['darkblue']};
    color: #fff;
    padding: 1rem 2rem;
    @media (hover: hover) {
      justify-content: flex-start;
      padding: 0 6rem;
    }
`

const FrameNumber = styled.div`
    font-size: 1.4rem;
    padding: 1rem 0;
    width: 10rem;

    @media (hover: hover) {
      font-size: 2rem;
      width: 20rem;
    }
`

const Dl = styled.dl`
    display: flex;
    justify-content: flex-start;
    padding: 0 0 1rem 0;
    margin: 0.4rem;
    @media (hover: hover) {
      justify-content: space-between;
    }
    ${props => props.primary && css` // used for displaying frame number
      //width: 200px;
      padding: 0;
    `}
`

const Dt = styled.dt`
    //display: inline-block;
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    GridDiv,
    CellWrap,
    Automaton,
    FrameNumberSection,
    FrameNumber,
    Dl,
    Dt,
    Dd
}