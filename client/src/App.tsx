import { GlobalStyle } from './styles/GlobalStyle'
import { DebugToggleStyle } from './styles/DebugToggle'
import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import deez from '../public/images/underwater_high_small.png'
// import {underwaterImg} from '../public/images/underwater.png'
// import {underwaterImg2} from './underwater_high_small.png's
// let debug_mode = false;

interface Sensors {
  temp: number
  ph: number
  tds: number
}

const dummy: Sensors = {
  temp: -1,
  ph: -1,
  tds: -1,
}

async function fetchSensorData(isDebug: boolean): Promise<Sensors> {
  const addr = 'http://192.168.0.175/sensors'
  const mockAddr = 'https://66cca760a4dd3c8a71b860e1.mockapi.io/sensors'
  console.log('Debug Mode is', isDebug)
  if (isDebug) {
    console.log('fetching', mockAddr)
    const response = await fetch(mockAddr)
    console.log('response', response)
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json()
      console.log('returning data and setting sensor var', data)
      return data[0]
    }
  } else {
    try {
      console.log('fetching', addr)
      const response = await fetch(addr)
      console.log('response', response)
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json()
        console.log('returning data and setting sensor var', data)
        return data
      } else {
        return dummy
      }
    } catch (e) {
      //something here to display in UI that an error has occurred
      return dummy
    }
  }
  return dummy
}

function getSensorClasses(
  val: number,
  warn_min: number,
  warn_max: number,
  hard_min: number,
  hard_max: number
): string {
  let classes = 'circle '
  if (val == -1) {
    classes += 'black'
  } else if (val <= hard_min || val >= hard_max) {
    classes += 'red'
  } else if (val <= warn_min || val >= warn_max) {
    classes += 'yellow'
  } else {
    classes += 'green'
  }
  return classes
}

function Sensors({ isDebug }: { isDebug: boolean }) {
  const [sensor, setSensorData] = useState<Sensors>(dummy)
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchSensorData(isDebug)
        setSensorData(data)
        // debugger;
      } catch (error) {
        console.log('got error while fetching', error)
        // setError(error.message);
      }
    }
    fetchData()

    // set to call itself at 5 second intervals
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId) // removes interval if sensor isn't rendered
  }, [isDebug])

  if (sensor) {
    return (
      <div className="sensor-row">
        <div className='sensor-entry'>
          <h3 className='sensor-title'>Temperature</h3>
          <Link to={`/temp`}>
            <div className={getSensorClasses(sensor.temp, 50, 80, 40, 90)}>
              <p>{sensor.temp}°F</p>
            </div>
          </Link>
        </div>

        <div className='sensor-entry'>
          <h3 className='sensor-title'>pH</h3>
          <Link to={`/ph`}>
            <div className={getSensorClasses(sensor.ph, 8, 10, 5, 11)}>
              <p>{sensor.ph}</p>
            </div>
          </Link>
        </div>

        <div className='sensor-entry'>
          <h3 className='sensor-title'>TDS</h3>
          <Link to={`/tds`}>
            <div className={getSensorClasses(sensor.tds, 50, 80, 40, 90)}>
              <p>{sensor.tds} ppm</p>
            </div>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <p>Cannot fetch sensor data...</p>
      </div>
    )
  }
}

function ToggleDebug({
  isDebug,
  toggleDebug,
}: {
  isDebug: boolean
  toggleDebug: () => void
}) {
  return (
    <>
      <p className="toggle-text">{isDebug ? 'Debug On' : 'Debug Off'}</p>
      <label className="switch toggle-button">
        <input type="checkbox" onClick={toggleDebug} />
        <span className="slider"></span>
      </label>
    </>
  )
}

export function App() {
  const [isDebug, setDebug] = useState(false)
  const toggleDebug = () => {
    console.log('Changing debug from', isDebug, 'to', !isDebug)
    setDebug(!isDebug)
    console.log('isDebug is now', isDebug)
  }

  return (
    <>
    <GlobalStyle />
    {/* <img src= '/images/underwater.png' alt='broke1' /> */}
    {/* <img src={deez} alt='broke2' onError={(e) => {console.log("image broken", e)}}/> */}
    <div className='bkg' style={{
        backgroundImage: `url(${deez})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
      }}>
      <DebugToggleStyle />
      <div className='title'>
        <h1><b>AquaMon Dashboard</b></h1>
      </div>
      <Sensors isDebug={isDebug} />
      <ToggleDebug isDebug={isDebug} toggleDebug={toggleDebug} />
    </div>
    </>
  )
}
