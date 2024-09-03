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

  .circle {
    height: 100px;
    width: 100px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
  }

  .circle p {
    padding: 40% 0;

  }

  .sensor-row {
    // margin-top: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .black {
    background-color: rgb(63, 63, 63);
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

  .toggle-button {
    position: absolute;
    right: 20px; /* Adjust this value as needed */
    bottom: 20px; /* Adjust this value as needed */
  }

  .toggle-text {
    position: absolute;
    right: 15px; /* Adjust this value as needed */
    bottom: 60px; /* Adjust this value as needed */
    font-family: Georgia;
    opacity: 50%;
  }

  #root {
    height: 100vh;
    width: 100vw;
    position: relative;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    color: beige;
  }
`
