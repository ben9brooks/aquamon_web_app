import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import * as Utils from './scripts/utils.js'

//Chart.register(BarController, BarElement, CategoryScale, LinearScale)

export function PH() {
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

    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [75,74,73,72,70,68,77,79],
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
            text: 'Weekly pH'
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
      <Link to={`/main_window`}>pH page </Link>
      <div className="canvas-bkg" style={{ backgroundColor: 'white' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}