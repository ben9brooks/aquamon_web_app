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
    height: 100%;
    margin: 0;
    padding: 0;
    // overflow: hidden;
  }

  html {
    height: 100%;
    margin: 0;
    padding: 0;
    // overflow: hidden;
  }

  .square {
    width: 10vw;
    height: 10vh;
  }

  .circle {
    height: 150px;
    width: 150px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
  }

  .circle p {
    padding: 40% 0;
    font-size: 1.3em;
  }

  .title {
    text-align: center;
    // margin-top: 4vh;
    margin-bottom: 7vh;
    color: #54BB8C;
  }

  

  .sensor-bkg {
    height: 100%;
    background-color: white;
  }

  .sensor-row {
    // margin-top: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .sensor-entry {
    display: flex;
    flex-direction: column;
  }

  .sensor-title {
    text-align: center;
    margin-bottom: 3vh;
    font-size: 1.6em;
    color: black;
  }

  .sensor-page-title {
    color: black
  }

  .black {
    background-color: rgb(63, 63, 63);
    color: white;
  }

  .red {
    background-color: red;
    color: white;
  }

  .yellow {
    color: black;
    background-color: yellow;
  }

  .green {
    background-color: green;
    color: white;
  }

  .toggle-button {
    position: absolute;
    right: 20px; /* Adjust this value as needed */
    bottom: 10px; /* Adjust this value as needed */
  }

  .toggle-text {
    position: absolute;
    right: 15px; /* Adjust this value as needed */
    bottom: 50px; /* Adjust this value as needed */
    font-family: Georgia;
    opacity: 70%;
  }

  #root {
    // height: 100vh;
    height: 100%;
    width: 100vw;
    position: relative;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    box-shadow: none;
    min-height: 100vh;

    // background-color: white;
    // background-image: url("../images/underwater.png");
    background-color: white; /* Ensure this is visible */
    background-image: url('.../public/images/underwater_high_small.png');
    background-size: cover; /* Ensures the image covers the entire div */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Prevent the image from repeating */
  }

  .graph-title-row {
    display: flex;
    flex-direction: row;
  }
  .graph-title-row h2 {
    margin: auto;
    padding-right: 3vw;
  }

  a {
    color: black;
    text-decoration: none; 
  }

  .canvas-bkg {
    background-color: white;
    max-height: 80vh;
  }

  .time-btn {
    padding: 15px 20px;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    outline: none;
    // color: #fff;
    // background-color: #8bdc00;
    border: none;
    border-radius: 15px;
    box-shadow: 0 5px  #18c7d0;
  }

  .time-pressed {
    box-shadow: none;
    transform: translateY(5px);
  }

  .btn-row {
    margin: 1vh auto 2vh auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

    //ratio: 374 h : 748 w
  .graph {
    // height: 374px !important;
    // width: 748px !important;
    // height: 70vh !important;
    // width: 80vw !important;
  }

  .button-40 {
    display: inline-flex; /* Allows the button to grow with content */
    // background-color: #1F2937; /* Set a default background color */
    background-color: #a4a6a6;
    color: #FFFFFF; /* White text */
    padding: .75rem 1.2rem;
    border: 1px solid transparent;
    border-radius: .75rem;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5rem;
    text-align: center;
    text-decoration: none; /* Remove underline from link */
    cursor: pointer;
    transition: background-color 0.2s cubic-bezier(.4, 0, 0.2, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    box-sizing: border-box; /* Include padding and border in element's total width */
    height: 5vh;
    width: 5vw;
    transform: rotate(180deg);
  }
  
  .button-40:hover {
    background-color: #374151; /* Darker on hover */
  }
  
  .button-40:focus {
    box-shadow: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  // @media (min-width: 768px) {
  //   .button-40 {
  //     padding: .75rem 1.5rem;
  //   }
  // }
`
