import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './/scripts/utils.js'
import 'chartjs-adapter-date-fns';
import { config } from 'webpack'

//Chart.register(BarController, BarElement, CategoryScale, LinearScale)

export function Tds() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // To store the chart instance
  const [chartData, setChartData] = useState<{ x: number, y: number }[]>([]) //store graph data
  const [timeUnit, setTimeUnit] = useState<'hour' | 'day' | 'week'>('hour');
  const [timeMin, setTimeMin] = useState<string | number | undefined>(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString());
  const [timeMax, setTimeMax] = useState<string | number | undefined>( new Date().toString());
  const LOWER_THRESHOLD = 13;
  const UPPER_THRESHOLD = 15;
  // const time_unit = 'day';

  console.log('min', timeMin);
  // Fetch data from the backend
  async function fetchData() {
    const response = await fetch('http://localhost:5001/tds-data') // Assuming you have a backend route for this
    const data = await response.json()
    console.log('data', data)

    // Assuming data is an array of { temp, timestamp }
    const formattedData = data.map((item: { tds: number, timestamp: number }) => ({
      x: new Date(item.timestamp),
      y: item.tds,
    }))
    // const formattedData2 = [];
    // for (let i =0; i < length(data); i++)

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
      label: 'TDS',
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

    // const data = {
    //   // labels: labels,
    //   datasets: [
    //     {
    //       label: 'TEMPERATURE',
    //       data: chartData, 
    //       borderColor: Utils.CHART_COLORS.red,
    //       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    //     }]
    //   }

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
              text: 'TDS'
            },
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Weekly TDS'
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
  }, [chartData, timeUnit, timeMin])

  // const myChart = new Chart(
  //   document.getElementById('deez'),
  //   config
  // )

  // function dateFilter(time: 'hour' | 'day' | 'week') {
  //   setTimeUnit(time);
  //   console.log(chartInstanceRef.current)
  //   chartInstanceRef.current?.update();
  // }

  return (
    <div>
      <Link to={`/main_window`}>tds page </Link>
      <div>
        <button onClick={() => {setTimeUnit('hour'); setTimeMin(new Date(new Date().getTime() - 1 * 60 * 60 * 1000).toISOString())}}>Hour</button>
        <button onClick={() => {setTimeUnit('day'); setTimeMin(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString())}}>Day</button>
        <button onClick={() => {setTimeUnit('week'); setTimeMin(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())}}>Week</button>
      </div>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef} id='deez'></canvas>
      </div>
    </div>
  )
}
