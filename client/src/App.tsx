import { GlobalStyle } from './styles/GlobalStyle'
import { DebugToggleStyle } from './styles/DebugToggle'
import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import deez from '../public/images/underwater.png';
import logoutPNG from '../public/images/logout.png'


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

export async function fetchSensorData(isDebug: boolean): Promise<Sensors> {
  const addr = 'http://192.168.0.175/sensors'
  const mockAddr = 'https://66cca760a4dd3c8a71b860e1.mockapi.io/sensors'
  console.log('Debug Mode is', isDebug)
  if (isDebug) {
    console.log('fetching', mockAddr)
    const response = await fetch(mockAddr)
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json()
      return data[0] // assuming the API returns an array of sensors
    }
  } else {
    try {
      console.log('fetching', addr)
      const response = await fetch(addr)
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json()
        return data
      } else {
        return dummy
      }
    } catch (e) {
      console.error('Error while fetching:', e)
      return dummy
    }
  }
  return dummy
}

export function getSensorClasses(
  val: number,
  warn_min: number,
  warn_max: number,
  hard_min: number,
  hard_max: number
): string {
  let classes = 'circle '
  if (val == -1) {
    classes += 'black'
  } else if (val > warn_min && val < warn_max) {
    classes += 'green'
  } else if (val < hard_min || val > hard_max) {
    classes += 'red'
  } else {
    classes += 'yellow'
  }
  return classes
}

export function Sensors({ isDebug }: { isDebug: boolean }) {
  const [sensor, setSensorData] = useState<Sensors>(dummy)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userParam, setUserParam] = useState<any>(null) // Assuming user parameters come here

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sensor data
        const data = await fetchSensorData(isDebug)
        setSensorData(data)

        // Fetch user parameters data
        const response = await fetch(`http://localhost:5001/user-parameters/0`)
        const userData = await response.json()
        setUserParam(userData)

        setLoading(false)
      } catch (error) {
        setError('Failed to fetch sensor data.')
        setLoading(false)
        console.error('Error while fetching data', error)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(intervalId) // Cleanup interval
  }, [isDebug])

  if (loading) {
    return <p>Cannot fetch sensor data...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (sensor.temp === -1 || sensor.ph === -1 || sensor.tds === -1) {
    return <div><p>Cannot fetch sensor data...</p></div>
  }

  return (
    <div className="sensor-row">
      <div className='sensor-entry'>
        <h3 className='sensor-title'>Temperature</h3>
        <Link to={`/temp`}>
          <div className={getSensorClasses(
            sensor.temp,
            userParam[0]?.temp_warn_min,
            userParam[0]?.temp_warn_max,
            userParam[0]?.temp_alert_min,
            userParam[0]?.temp_alert_max
          )}>
            <p>{sensor.temp}°F</p>
          </div>
        </Link>
      </div>

      <div className='sensor-entry'>
        <h3 className='sensor-title'>pH</h3>
        <Link to={`/ph`}>
          <div className={getSensorClasses(
            sensor.ph,
            userParam[0]?.ph_warn_min,
            userParam[0]?.ph_warn_max,
            userParam[0]?.ph_alert_min,
            userParam[0]?.ph_alert_max
          )}>
            <p>{sensor.ph}</p>
          </div>
        </Link>
      </div>

      <div className='sensor-entry'>
        <h3 className='sensor-title'>TDS</h3>
        <Link to={`/tds`}>
        <div className={getSensorClasses(
            sensor.tds,
            userParam[0]?.tds_warn_min,
            userParam[0]?.tds_warn_max,
            userParam[0]?.tds_alert_min,
            userParam[0]?.tds_alert_max
          )}>
          <p>{sensor.tds} ppm</p>
        </div>
        </Link>
      </div>
    </div>
  )
}

export function ToggleDebug({
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
  const { logout } = useAuth(); // Get the logout function
  const navigate = useNavigate(); // Hook for navigation
  const [isDebug, setDebug] = useState(false)
  const toggleDebug = () => {
    console.log('Changing debug from', isDebug, 'to', !isDebug)
    setDebug(!isDebug)
    console.log('isDebug is now', isDebug)
  }

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/login'); // Navigate to the login page
  };


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
      <div className='header'>
        <div className='title'>
          <h1>
            <b>AquaMon Dashboard</b>
          </h1>
        </div>
        <div className='hover-container-logout'>
          <img id="myBtn2" src={logoutPNG} onClick={handleLogout}/>
        </div>
      </div>
      <Sensors isDebug={isDebug} />
      <ToggleDebug isDebug={isDebug} toggleDebug={toggleDebug} />
      
    </div>
    </>
  )
}
