import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './/scripts/utils.js'
import 'chartjs-adapter-date-fns';
import { config } from 'webpack'
import chevron from '../public/images/next.png';
import settings from '../public/images/settings.png';
import RangeSlider from './components/RangeSlider'

const hourTitle = "pH Over the Last Hour"
const dayTitle = "pH Over the Last Day"
const weekTitle = "pH Over the Last Week"

interface SliderData {
  temp_warn_min: number;
  temp_warn_max: number;
  temp_alert_min: number;
  temp_alert_max: number;
  ph_warn_min: number, 
  ph_warn_max: number,
  ph_alert_min: number, 
  ph_alert_max: number,
  tds_warn_min: number, 
  tds_warn_max: number,
  tds_alert_min: number, 
  tds_alert_max: number
}

class SliderDataConstructor implements SliderData {
  temp_warn_min: number;
  temp_warn_max: number;
  temp_alert_min: number;
  temp_alert_max: number;
  ph_warn_min: number;
  ph_warn_max: number;
  ph_alert_min: number;
  ph_alert_max: number;
  tds_warn_min: number;
  tds_warn_max: number;
  tds_alert_min: number;
  tds_alert_max: number;

  constructor(
    ph_warn_min: number,
    ph_warn_max: number,
    ph_alert_min: number,
    ph_alert_max: number
  ) {
    this.temp_warn_min = -100; //invalid, or Do Not Update
    this.temp_warn_max = -100;
    this.temp_alert_min = -100;
    this.temp_alert_max = -100;
    this.ph_warn_min = ph_warn_min; 
    this.ph_warn_max = ph_warn_max;
    this.ph_alert_min = ph_alert_min;
    this.ph_alert_max = ph_alert_max;
    this.tds_warn_min = -100;
    this.tds_warn_max = -100;
    this.tds_alert_min = -100;
    this.tds_alert_max = -100;
  }
}

function set_button_press_style(type: string) {
  //when a button is clicked, set that one as the 'pressed' style, and change the others to be lifted up.
  document.getElementById('hour-btn')!.className = "time-btn";
  document.getElementById('day-btn')!.className = "time-btn";
  document.getElementById('week-btn')!.className = "time-btn";
  document.getElementById(type)!.className = 'time-btn time-pressed';
}

async function get_parameter_value(userId: number, name: string): Promise<number> {
  const response = await fetch(`http://localhost:5001/user-parameters/${userId}/${name}`);
  const data = await response.json();
  return data[0][name];
}

export function PH() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // To store the chart instance
  const [chartData, setChartData] = useState<{ x: number, y: number }[]>([]) //store graph data
  const [timeUnit, setTimeUnit] = useState<'hour' | 'day' | 'week'>('hour');
  const [timeMin, setTimeMin] = useState<string | number | undefined>(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString());
  const [timeMax, setTimeMax] = useState<string | number | undefined>( new Date().toString());
  const [graphTitle, setGraphTitle] = useState(hourTitle)
  const [minY, setMinY] = useState<number>(Infinity);
  const [maxY, setMaxY] = useState<number>(-Infinity);
  const [sliderValueWarn, setSliderValueWarn] = useState<number[]>([10, 12]);
  const [sliderValueAlert, setSliderValueAlert] = useState<number[]>([10, 12]);

  useEffect(() => {
    const fetchSliderValue = async () => {
      const phWarnMin = await get_parameter_value(0, 'ph_warn_min');
      const phWarnMax = await get_parameter_value(0, 'ph_warn_max');
      const phAlertMin = await get_parameter_value(0, 'ph_alert_min');
      const phAlertMax = await get_parameter_value(0, 'ph_alert_max');
      setSliderValueWarn([phWarnMin, phWarnMax]);
      setSliderValueAlert([phAlertMin, phAlertMax]);
    };

    fetchSliderValue();
  }, []); //occurs on-load of pH page

  const handleSliderChangeWarn = (newValue: number[]) => {
    console.log("change", newValue);
    setSliderValueWarn(newValue); // Update the state with the new value
  };
  const handleSliderChangeAlert = (newValue: number[]) => {
    setSliderValueAlert(newValue); // Update the state with the new value
  };

  // Fetch data from the backend
  async function fetchData() {
    const response = await fetch('http://localhost:5001/ph-data') // Assuming you have a backend route for this
    const data = await response.json()
    console.log('data', data)

    // Assuming data is an array of { temp, timestamp }
    const formattedData = data.map((item: { ph: number, timestamp: number }) => ({
      x: new Date(item.timestamp),
      y: item.ph,
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

    // console.log(formattedData)
    console.log('min', timeMin);
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
      if (point.y < sliderValueAlert[0] || point.y > sliderValueAlert[1]) {
        return 'red'; // Red fill for out of range
      } else if (point.y === sliderValueWarn[0] || point.y === sliderValueWarn[1]) {
        return 'orange'; // Orange fill for boundary
      }
      return 'green'; // Green fill for in range
    });

    const pointBorderColors = chartData.map(point => {
      if (point.y < sliderValueAlert[0] || point.y > sliderValueAlert[1]) {
        return 'darkred'; // Dark red border for out of range
      } else if (point.y === sliderValueWarn[0] || point.y === sliderValueWarn[1]) {
        return 'orange'; // Orange border for boundary
      }
      return 'green'; // Blue border for in range
    });

    const lineColor = chartData.some(point => point.y < sliderValueAlert[0] || point.y > sliderValueAlert[1]) ? 'red' : 'green';

    const dataset = {
      label: 'pH',
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
              text: 'pH'
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
  }, [chartData, timeUnit, timeMin, graphTitle, minY, maxY, sliderValueWarn, sliderValueAlert])

  // const myChart = new Chart(
  //   document.getElementById('deez'),
  //   config
  // )

  // function dateFilter(time: 'hour' | 'day' | 'week') {
  //   setTimeUnit(time);
  //   console.log(chartInstanceRef.current)
  //   chartInstanceRef.current?.update();
  // }

  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  window.onclick = function(event) {
    if (event.target == modal) {
      modal!.style.display = "none";
    }
  }

  const upload_parameters = async (userId: number, updatedDataWarn: number[], updatedDataAlert: number[] ): Promise<void> => {
    const newJohn = new SliderDataConstructor(updatedDataWarn[0], updatedDataWarn[1], updatedDataAlert[0], updatedDataAlert[1])    
    console.log("submit press", newJohn);
    console.log(JSON.stringify(newJohn)); 
    try {
      const response = await fetch(`http://localhost:5001/upload-user-parameters/${userId}`, {
        method: 'PUT', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(newJohn), // Convert the data to JSON
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
        <div className='hover-container'>
          <img id="myBtn" src={settings} onClick={() => {modal!.style.display = "block";}}/>
        </div>
        {/* <button id="myBtn" onClick={() => {modal!.style.display = "block";}}>Open Modal</button> */}
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
        <h2>pH Warning Settings</h2>
        <div className='slider-panel'>
          <div className='slider-row'>
            <div className='row-item'>
              <RangeSlider sensor="ph-green" value={sliderValueWarn} onChange={handleSliderChangeWarn} inverted={false} minBound={0} maxBound={14} step={0.5}/>
            </div>
            <div className='row-item'>
              <p>Healthy Range: {sliderValueWarn[0]} to {sliderValueWarn[1]}</p>
            </div>
          </div>
          <div className='slider-row'>
            <div className='row-item'>
              <RangeSlider sensor="ph-yellow" value={sliderValueAlert} onChange={handleSliderChangeAlert} inverted={true} minBound={0} maxBound={14} step={0.5}/>
            </div>
            <div className='row-item'>
              <p>Alert Range: Below {sliderValueAlert[0]} and Above {sliderValueAlert[1]}</p>
            </div>
          </div>
        </div>
        <button className='submit-param-btn' onClick={() => {upload_parameters(0, sliderValueWarn, sliderValueAlert)}}>Submit</button>
      </div>
    </div>
    </>
  )
}
