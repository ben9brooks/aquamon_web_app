import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './/scripts/utils.js'
import 'chartjs-adapter-date-fns';
import { config } from 'webpack'
import chevron from '../public/images/next.png';
import RangeSlider from './components/RangeSlider'

const hourTitle = "Temperature Over the Last Hour"
const dayTitle = "Temperature Over the Last Day"
const weekTitle = "Temperature Over the Last Week"

// function valuetext(value: number) {
//   return `${value}°C`;
// }

function set_button_press_style(type: string) {
  //when a button is clicked, set that one as the 'pressed' style, and change the others to be lifted up.
  document.getElementById('hour-btn')!.className = "time-btn";
  document.getElementById('day-btn')!.className = "time-btn";
  document.getElementById('week-btn')!.className = "time-btn";
  document.getElementById(type)!.className = 'time-btn time-pressed';
}

export function Temp() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // To store the chart instance
  const [chartData, setChartData] = useState<{ x: number, y: number }[]>([]) //store graph data
  const [timeUnit, setTimeUnit] = useState<'hour' | 'day' | 'week'>('hour');
  const [timeMin, setTimeMin] = useState<string | number | undefined>(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString());
  const [timeMax, setTimeMax] = useState<string | number | undefined>( new Date().toString());
  const [graphTitle, setGraphTitle] = useState(hourTitle)
  const [minY, setMinY] = useState<number>(Infinity);
  const [maxY, setMaxY] = useState<number>(-Infinity);
  const [sliderValueWarn, setSliderValueWarn] = useState<number[]>([40, 60]);
  const [sliderValueAlert, setSliderValueAlert] = useState<number[]>([40, 60]);

  const LOWER_THRESHOLD = 70;
  const UPPER_THRESHOLD = 80;
  
  const handleSliderChangeWarn = (newValue: number[]) => {
    setSliderValueWarn(newValue); // Update the state with the new value
  };
  const handleSliderChangeAlert = (newValue: number[]) => {
    setSliderValueAlert(newValue); // Update the state with the new value
  };

  async function fetchData() {
    const response = await fetch('http://localhost:5001/temp-data') // Assuming you have a backend route for this
    const data = await response.json()
    // console.log('data', data)

    // Assuming data is an array of { temp, timestamp }
    const formattedData = data.map((item: { temp: number, timestamp: number }) => ({
      x: new Date(item.timestamp),
      y: item.temp,
    }))

    let localMinY = Infinity;
    let localMaxY = -Infinity;

    for (let i = 0; i < formattedData.length; i++) {
      let temp = formattedData[i].y;
      // console.log(temp)
    
      // Update minTemp if the current temperature is lower
      if (temp < localMinY) {
        localMinY = temp;
      }
    
      // Update maxTemp if the current temperature is higher
      if (temp > localMaxY) {
        localMaxY = temp;
      }
    }

    // round max up to the next 5 and min to the bottom 5.
    localMaxY = Math.floor(localMaxY / 5) * 5;
    localMaxY = localMaxY + 5;
    localMinY = Math.floor(localMinY / 5) * 5;
    localMinY = localMinY - 5;  
    setMaxY(localMaxY);
    setMinY(localMinY);

    setChartData(formattedData)
  }
  
  // setInterval(fetchData, 5000);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // fetchData();
    console.log('fetching')

    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy the previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const pointFillColors = chartData.map(point => {
      if (point.y < LOWER_THRESHOLD || point.y > UPPER_THRESHOLD) {
        return 'red'; // Red fill for out of range
      } else if (point.y === LOWER_THRESHOLD || point.y === UPPER_THRESHOLD) {
        return 'orange'; // Orange fill for boundary
      }
      return 'green'; // Green fill for in range
    });

    const pointBorderColors = chartData.map(point => {
      if (point.y < LOWER_THRESHOLD || point.y > UPPER_THRESHOLD) {
        return 'darkred'; // Dark red border for out of range
      } else if (point.y === LOWER_THRESHOLD || point.y === UPPER_THRESHOLD) {
        return 'orange'; // Orange border for boundary
      }
      return 'green'; // Blue border for in range
    });

    const lineColor = chartData.some(point => point.y < LOWER_THRESHOLD || point.y > UPPER_THRESHOLD) ? 'red' : 'green';

    const dataset = {
      label: 'Temperature',
      data: chartData,
      borderColor: lineColor, 
      pointBackgroundColor: pointFillColors,
      pointBorderColor: pointBorderColors,
      pointBorderWidth: 2,
      fill: false,
    };

    const data = {
      datasets: [dataset],
    };


    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            offset: false,
            type: 'time', 
            title: {
              display: true,
              text: 'Timestamp',
            },
            time: {
              unit: timeUnit,
              // tooltipFormat: 'MMM dd, yyyy',
            },
            min: timeMin,
            max: timeMax,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature'
            },
            min: minY,
            max: maxY,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: graphTitle
          }
        }
      },
    })
    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [chartData, timeUnit, timeMin, graphTitle, minY, maxY])

  // const myChart = new Chart(
  //   document.getElementById('deez'),
  //   config
  // )

  // function dateFilter(time: 'hour' | 'day' | 'week') {
  //   setTimeUnit(time);
  //   console.log(chartInstanceRef.current)
  //   chartInstanceRef.current?.update();
  // }
  // console.log("About to return graph..", minY, maxY)

  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  // btn!.onclick = function() {
  //   modal!.style.display = "block";
  // }

  // // When the user clicks on <span> (x), close the modal
  // span.onclick = function() {
  //   modal.style.display = "none";
  // }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal!.style.display = "none";
    }
  }

  const upload_parameters = async (userId: number, updatedData: number[] ): Promise<void> => {
    console.log("submit press");
    try {
      const response = await fetch(`http://localhost:5001/upload-user-parameters/${userId}`, {
        method: 'PUT', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(updatedData), // Convert the data to JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json(); // If you expect a response body
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Error updating user parameters:', error);
    }
  }

  return (
    <>
    <GlobalStyle />
    <div className='sensor-bkg'>

      <div className='graph-title-row'>
        <Link to={`/main_window`} className='button-40'>
          {/* <img src='../public/images/next.png' alt='no img' /> */}
          <img src= {chevron} alt='no img' />
        </Link>
        <h2 className='sensor-page-title'>Temperature</h2>
        <button id="myBtn" onClick={() => {modal!.style.display = "block";}}>Open Modal</button>
      </div>
      <div className='btn-row'>
        <button id='hour-btn' className='time-btn time-pressed' onClick={() => {setTimeUnit('hour'); setTimeMin(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString()); setGraphTitle(hourTitle); set_button_press_style('hour-btn')}}>Hour</button>
        <button id='day-btn' className='time-btn' onClick={() => {setTimeUnit('day'); setTimeMin(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(dayTitle); set_button_press_style('day-btn')}}>Day</button>
        <button id='week-btn' className='time-btn' onClick={() => {setTimeUnit('week'); setTimeMin(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(weekTitle); set_button_press_style('week-btn')}}>Week</button>
      </div>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef} className='graph'></canvas>
      </div>
    </div>
    <div id="myModal" className="modal">

      <div className="modal-content">
        <span className="close" onClick={() => {modal!.style.display = "none"}}>&times;</span>
        <p>Some text in the Modal..</p>
        <RangeSlider sensor="temp-green" value={sliderValueWarn} onChange={handleSliderChangeWarn}/>
        <RangeSlider sensor="temp-yellow" value={sliderValueAlert} onChange={handleSliderChangeAlert}/>
        <button onClick={() => {upload_parameters()}}>SUBMIT</button>
      </div>

    </div>
    </>
  )
}
