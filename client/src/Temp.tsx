import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './/scripts/utils.js'

//Chart.register(BarController, BarElement, CategoryScale, LinearScale)

export function Temp() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // To store the chart instance
  const [chartData, setChartData] = useState<{ x: number, y: number }[]>([]) //store graph data

  // Fetch data from the backend
  async function fetchData() {
    const response = await fetch('http://localhost:5001/temp-data') // Assuming you have a backend route for this
    const data = await response.json()
    console.log('data', data)

    // Assuming data is an array of { temp, timestamp }
    const formattedData = data.map((item: { temp: number, timestamp: number }) => ({
      x: item.timestamp,
      y: item.temp,
    }))

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

    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const data = {
      // labels: labels,
      datasets: [
        {
          label: 'TEMPERATURE',
          data: chartData, 
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }]
      }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Timestamp'
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature'
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
            text: 'Weekly Temperature'
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
  }, [chartData])

  return (
    <div>
      <Link to={`/main_window`}>temp page </Link>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}
