import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './/scripts/utils.js'

//Chart.register(BarController, BarElement, CategoryScale, LinearScale)

export function Temp() {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // To store the chart instance

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy the previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

    const labels = Utils.months({count: 7});
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [0,1,2,3,4,5,6,4,3,23,45,64,2,1],
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        }]
      }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
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
  }, [])

  return (
    <div>
      <Link to={`/main_window`}>temp page </Link>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}
