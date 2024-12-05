import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import 'chartjs-adapter-date-fns';
import chevron from '../public/images/next.png';
import settings from '../public/images/settings.png';
import RangeSlider from './components/RangeSlider'
import { make_time_title, fetch_slider_then_graph_data, make_colors, upload_parameters, create_chart_config } from './sensor_helpers/Sensor_Helper'; //import funcs
import { backendAddress } from './App';

// parameters to mock:
const temp_min = 80;
const temp_max = 90;
const interval_min = 10;
const time_frame = 7 * 24; // 1 week in hours

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
  const [graphTitle, setGraphTitle] = useState(make_time_title("Temperature", "Hour"));
  const [minY, setMinY] = useState<number>(Infinity);
  const [maxY, setMaxY] = useState<number>(-Infinity);
  const [sliderValueWarn, setSliderValueWarn] = useState<number[]>([40, 60]);
  const [sliderValueAlert, setSliderValueAlert] = useState<number[]>([40, 60]);
  const [reloadGraph, setReloadGraph] = useState<boolean>(false);

  const handleSliderChangeWarn = (newValue: number[]) => {
    console.log("change", newValue);
    setSliderValueWarn(newValue); // Update the state with the new value
  };
  const handleSliderChangeAlert = (newValue: number[]) => {
    setSliderValueAlert(newValue); // Update the state with the new value
  };

  useEffect(() => {
    fetch_slider_then_graph_data('temp', setMaxY, setMinY, setChartData, setReloadGraph, reloadGraph, setSliderValueWarn, setSliderValueAlert);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy the previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    console.log('UPDATE', sliderValueAlert, sliderValueWarn);
    const pointFillColors = make_colors(chartData, sliderValueAlert, sliderValueWarn, 'red', 'green','yellow');
    const pointBorderColors = make_colors(chartData, sliderValueAlert, sliderValueWarn, 'darkred', 'green','yellow');

    chartInstanceRef.current = new Chart(ctx, create_chart_config(chartData, pointFillColors, pointBorderColors, timeUnit, timeMin, timeMax, minY, maxY, graphTitle));
   
    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [reloadGraph]) //[chartData, timeUnit, timeMin, graphTitle, minY, maxY, sliderValueWarn, sliderValueAlert]) //could prevent twitching by removing slider vars with new one on submit click

  var modal = document.getElementById("myModal");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal!.style.display = "none";
    }
  }

  const mock_data = async() => {
    try {
      const response = await fetch(`${backendAddress}/mock/temp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([temp_min, temp_max, interval_min, time_frame]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error while trying to mock data! Status: ${response.status}`);
      }

      console.log("Mock data successful");
    } catch {
      console.log("Error while contacting back end to mock data");
    }
  };

  return (
    <>
    <GlobalStyle />
    <div className='sensor-bkg'>

      <div className='graph-title-row'>
        <Link to={`/main_window`} className='button-40'>
          <img src= {chevron} alt='no img' />
        </Link>
        <h2 className='sensor-page-title'>Temperature</h2>
        <div className='hover-container'>
          <img id="myBtn" src={settings} onClick={() => {modal!.style.display = "block";}}/>
        </div>
      </div>
      <div className='btn-row'>
        <button id='hour-btn' className='time-btn time-pressed' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('hour'); setTimeMin(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("Temperature", "Hour")); set_button_press_style('hour-btn')}}>Hour</button>
        <button id='day-btn' className='time-btn' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('day'); setTimeMin(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("Temperature", "Day")); set_button_press_style('day-btn')}}>Day</button>
        <button id='week-btn' className='time-btn' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('week'); setTimeMin(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("Temperature", "Week")); set_button_press_style('week-btn')}}>Week</button>
      </div>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef} className='graph'></canvas>
      </div>
    </div>
    <div id="myModal" className="modal">

      <div className="modal-content">
        <span className="close" onClick={() => {modal!.style.display = "none"}}>&times;</span>
        <h2>Temperature Warning Settings</h2>
        <div className='slider-panel'>
          <div className='slider-row'>
            <div className='row-item'>
              <RangeSlider sensor="temp-green" value={sliderValueWarn} onChange={handleSliderChangeWarn} inverted={false} minBound={0} maxBound={100} step={1}/>
            </div>
            <div className='row-item'>
              <p>Healthy Range: {sliderValueWarn[0]} to {sliderValueWarn[1]} °F</p>
            </div>
          </div>
          <div className='slider-row'>
            <div className='row-item'>
              <RangeSlider sensor="temp-yellow" value={sliderValueAlert} onChange={handleSliderChangeAlert} inverted={true} minBound={0} maxBound={100} step={1}/>
            </div>
            <div className='row-item'>
              <p>Alert Range: Below {sliderValueAlert[0]} and Above {sliderValueAlert[1]} °F</p>
            </div>
          </div>
        </div>
        <button className='submit-param-btn' onClick={() => {upload_parameters('temp', 0, sliderValueWarn, sliderValueAlert); setReloadGraph(!reloadGraph); modal!.style.display = "none";}}>Submit</button>
      </div>
      <button onClick={mock_data} className='bot-left'>
        Mock
      </button>
    </div>
    </>
  )
}