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

  canvas {
    margin: 0 1vw;
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

    .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
    color: rgb(0, 0, 0);
    }

    
  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .slider-panel p {
    // margin: 0 3vw 0 3vw;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: auto;
    margin-left: 0;
  }
  .slider-panel {
    display: flex;
    flex-direction: column;
    align-items: stretch; /* Ensures the .slider-row divs take full width */
    gap: 10px; /* Optional: add spacing between rows */
    width: 100%;
  }

  .slider-row {
    display: flex;
    width: 100%;
  }

  .row-item {
    flex: 1; /* Ensures the row items take equal width */
    display: flex;
    align-items: center; /* Center content vertically */
    justify-content: center; /* Center content horizontally */
    text-align: center;
  }

  .submit-param-btn {
    border-radius: 30px;
    border: #6eaeee;
    background-color: #efecec;
    text-align: center;
    padding: 1vh 1vw;
    border-style: solid;
    transition: background-color 0.4s ease, color 0.4s ease;
  }
  
  .submit-param-btn:hover {
    background-color: #6eaeee;
    cursor: pointer;
    color: #efecec;

  }

  #myBtn {
    width: 50px;
    height: auto;
    // margin-right: 1vw;
  }

  #myBtn:hover {
    cursor: pointer;
  }

  #myBtn2 {
    width: 30px;
    height: auto;
    // margin-right: 1vw;
  }

  #myBtn2:hover {
    cursor: pointer;
  }

  .hover-container {
    display: inline-block;
    position: relative;
    padding: 10px;
    border-radius: 50%; /* Ensures circular background */
    background-color: transparent; /* Default background is transparent */
    // transition: background-color 0.4s ease, transform 0.4s ease;
  }

  .hover-container::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: #18c7d0; /* Circle color */
    transition: all 0.4s ease;
    transform: translate(-50%, -50%) scale(0); /* Start small and centered */
    z-index: 0; /* Behind the image */
  }

  .hover-container img {
    position: relative;
    z-index: 1; /* Ensures the image stays above the background */
    width: 100px; /* Adjust size as needed */
    height: 100px;
    // display: block;
  }

// .hover-container:hover {
//   background-color: #3498db; /* Background color on hover */
//   // transform: scale(1.1); /* Optional: Slightly enlarge the circle on hover */
// }
  .hover-container:hover::before {
    width: 60px; /* Final circle size (adjust as needed) */
    height: 60px;
    transform: translate(-50%, -50%) scale(1); /* Fully visible and centered */
  }

  .header {
    display: flex; /* Use flexbox for layout */
    justify-content: space-between; /* Space between title and button */
    align-items: center; /* Align items vertically centered */
    padding: 20px; /* Add some padding */
  }
  
  .title {
    flex-grow: 1; /* Allow title to take up remaining space */
    text-align: center; /* Center the title text */
  }

  .title b {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 60px;
    color: #54BB8C;
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-text-stroke: 3px black;
    // overflow: hidden;
  }
  
  .logout-button {
    background-color: #f44336; /* Example button color */
    color: white; /* Button text color */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    padding: 10px 20px; /* Padding for button */
    cursor: pointer; /* Cursor style on hover */
    transition: background-color 0.3s; /* Transition effect */
  }
  
  .logout-button:hover {
    background-color: #d32f2f; /* Darker shade on hover */
  }

  .hover-container-logout {
    display: inline-block;
    position: relative;
    padding: 10px;
    border-radius: 50%; /* Ensures circular background */
    background-color: transparent; /* Default background is transparent */
    // transition: background-color 0.4s ease, transform 0.4s ease;
  }

  .hover-container-logout::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background-color: white; /* Circle color */
    transition: all 0.4s ease;
    transform: translate(-50%, -50%) scale(0); /* Start small and centered */
    z-index: 0; /* Behind the image */
  }

  .hover-container-logout img {
    position: relative;
    z-index: 1; /* Ensures the image stays above the background */
    width: 25px; /* Adjust size as needed */
    height: 25px;
    // display: block;
  }

// .hover-container-logout:hover {
//   background-color: #3498db; /* Background color on hover */
//   // transform: scale(1.1); /* Optional: Slightly enlarge the circle on hover */
// }
  .hover-container-logout:hover::before {
    width: 60px; /* Final circle size (adjust as needed) */
    height: 60px;
    transform: translate(-50%, -50%) scale(1); /* Fully visible and centered */
  }
  `
