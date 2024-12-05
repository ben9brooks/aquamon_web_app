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
import { make_time_title, fetch_slider_then_graph_data, make_colors, upload_parameters, create_chart_config } from './sensor_helpers/Sensor_Helper'; //import funcs

// parameters to mock:
const ph_min = 8;
const ph_max = 9;
const interval_min = 10;
const time_frame = 7 * 24; // 1 week in hours

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
  const [graphTitle, setGraphTitle] = useState(make_time_title("pH", "Hour"));
  const [minY, setMinY] = useState<number>(Infinity);
  const [maxY, setMaxY] = useState<number>(-Infinity);
  const [sliderValueWarn, setSliderValueWarn] = useState<number[]>([10, 12]);
  const [sliderValueAlert, setSliderValueAlert] = useState<number[]>([10, 12]);
  const [reloadGraph, setReloadGraph] = useState<boolean>(false);

  const handleSliderChangeWarn = (newValue: number[]) => {
    console.log("change", newValue);
    setSliderValueWarn(newValue); // Update the state with the new value
  };
  const handleSliderChangeAlert = (newValue: number[]) => {
    setSliderValueAlert(newValue); // Update the state with the new value
  };

  useEffect(() => {
    fetch_slider_then_graph_data('ph', setMaxY, setMinY, setChartData, setReloadGraph, reloadGraph, setSliderValueWarn, setSliderValueAlert);
  }, []); //occurs on-load of pH page

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy the previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const pointFillColors = make_colors(chartData, sliderValueAlert, sliderValueWarn, 'red', 'green','yellow');
    const pointBorderColors = make_colors(chartData, sliderValueAlert, sliderValueWarn, 'darkred', 'green','yellow');

    // const lineColor = chartData.some(point => point.y < sliderValueAlert[0] || point.y > sliderValueAlert[1]) ? 'red' : 'green';

    chartInstanceRef.current = new Chart(ctx, create_chart_config(chartData, pointFillColors, pointBorderColors, timeUnit, timeMin, timeMax, minY, maxY, graphTitle));

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [reloadGraph])//[chartData, timeUnit, timeMin, graphTitle, minY, maxY, sliderValueWarn, sliderValueAlert])

  var modal = document.getElementById("myModal");

  window.onclick = function(event) {
    if (event.target == modal) {
      modal!.style.display = "none";
    }
  }

  const mock_data = async() => {
    try {
      const response = await fetch(`http://localhost:5001/mock/ph`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([ph_min, ph_max, interval_min, time_frame]),
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
          {/* <img src='../public/images/next.png' alt='no img' /> */}
          <img src= {chevron} alt='no img' />
        </Link>
        <h2 className='sensor-page-title'>pH</h2>
        <div className='hover-container'>
          <img id="myBtn" src={settings} onClick={() => {modal!.style.display = "block";}}/>
        </div>
        {/* <button id="myBtn" onClick={() => {modal!.style.display = "block";}}>Open Modal</button> */}
      </div>
      <div className='btn-row'>
        <button id='hour-btn' className='time-btn time-pressed' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('hour'); setTimeMin(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("pH", "Hour")); set_button_press_style('hour-btn')}}>Hour</button>
        <button id='day-btn' className='time-btn' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('day'); setTimeMin(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("pH", "Day")); set_button_press_style('day-btn')}}>Day</button>
        <button id='week-btn' className='time-btn' onClick={() => {setReloadGraph(!reloadGraph); setTimeUnit('week'); setTimeMin(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()); setGraphTitle(make_time_title("pH", "Week")); set_button_press_style('week-btn')}}>Week</button>
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
        <button className='submit-param-btn' onClick={() => {upload_parameters('ph', 0, sliderValueWarn, sliderValueAlert); modal!.style.display = "none"; setReloadGraph(!reloadGraph);}}>Submit</button>
      </div>
      <button onClick={mock_data} className='bot-left'>
        Mock
      </button>
    </div>
    </>
  )
}
