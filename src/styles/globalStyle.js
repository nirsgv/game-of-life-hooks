import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

    #root {
      overflow: hidden;
    }

    *, *:before, *:after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      
      @media (hover: none) {
          touch-action: manipulation;
      }
    }
    html {
      font-size: 62.5%;
    }

    body {
      font-size: 1.6rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: 'Kaushan Script', cursive;
    }
    
    button {
      font-family: 'Open Sans', sans-serif;
      font-weight: 300;
    }
    
    input[type="number"] {
      width: 10rem;
    }
    
    svg {
    width: 1em;
    fill: currentColor;
    font-size: 2em;
    text-align: center;
    vertical-align: middle;
    box-sizing: content-box;
    }
`;

export default GlobalStyle;