import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #E1E1E6;
  }

  .square {
    width: 10vw;
    height: 10vh;
  }

  .sensor-row {
    display: flex;
    flex-direction: row;
  }

  .black {
    background-color: black;
  }

  .red {
    background-color: red;
  }

  .yellow {
      color: black;
      background-color: yellow;
  }

  .green {
      background-color: green;
  }
`
