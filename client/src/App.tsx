import { GlobalStyle } from './styles/GlobalStyle'
import { DebugToggleStyle } from './styles/DebugToggle'
import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'; 
import deez from '../public/images/underwater.png'
import logoutPNG from '../public/images/logout.png'

const arduinoAddress = 'http://192.168.0.175/sensors';

interface Sensors {
  temp: number
  ph: number
  tds: number
}

interface UserParams {
  temp_warn_min: number,
  temp_warn_max: number,
  temp_alert_min: number,
  temp_alert_max: number,
  ph_warn_min: number, 
  ph_warn_max: number,
  ph_alert_min: number, 
  ph_alert_max: number,
  tds_warn_min: number, 
  tds_warn_max: number,
  tds_alert_min: number, 
  tds_alert_max: number
}

const dummy: Sensors = {
  temp: -1,
  ph: -1,
  tds: -1,
}

async function fetchSensorData(isDebug: boolean): Promise<Sensors> {
  const addr = arduinoAddress;
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

async function get_parameter_values(userId: number): Promise<UserParams> {
  const response = await fetch(`http://localhost:5001/user-parameters/${userId}`);
  const data = await response.json();
  return data[0];
}

function Sensors({ isDebug }: { isDebug: boolean }) {
  const [sensor, setSensorData] = useState<Sensors>(dummy)
  const [user_params_temp, setUserParamsTemp] = useState<number[]>([50, 80, 40, 90]);
  const [user_params_ph, setUserParamsPh] = useState<number[]>([8, 10, 5, 11]);
  const [user_params_tds, setUserParamsTds] = useState<number[]>([50, 80, 40, 90]);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserParams = async () => {
      try {
        const user_params = await get_parameter_values(0); // must await the promise to change types
        console.log('user_params', user_params);
        
        setUserParamsTemp([
          user_params.temp_warn_min, 
          user_params.temp_warn_max, 
          user_params.temp_alert_min, 
          user_params.temp_alert_max
        ]);
        
        setUserParamsPh([
          user_params.ph_warn_min, 
          user_params.ph_warn_max, 
          user_params.ph_alert_min, 
          user_params.ph_alert_max
        ]);
        
        setUserParamsTds([
          user_params.tds_warn_min, 
          user_params.tds_warn_max, 
          user_params.tds_alert_min, 
          user_params.tds_alert_max
        ]);
        
        console.log('Updating user params', user_params_temp, user_params_ph, user_params_tds);
      } catch (error) {
        console.error('Error fetching user parameters:', error);
        // Optional: Handle error with state
        // setError('Failed to fetch user parameters');
      }
    };
  
    fetchUserParams();
  }, []);

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
            <div className={getSensorClasses(sensor.temp, user_params_temp[0], user_params_temp[1], user_params_temp[2], user_params_temp[3])}>
              <p>{sensor.temp}°F</p>
            </div>
          </Link>
        </div>

        <div className='sensor-entry'>
          <h3 className='sensor-title'>pH</h3>
          <Link to={`/ph`}>
            <div className={getSensorClasses(sensor.ph, user_params_ph[0], user_params_ph[1], user_params_ph[2], user_params_ph[3])}>
              <p>{sensor.ph}</p>
            </div>
          </Link>
        </div>

        <div className='sensor-entry'>
          <h3 className='sensor-title'>TDS</h3>
          <Link to={`/tds`}>
            <div className={getSensorClasses(sensor.tds, user_params_tds[0], user_params_tds[1], user_params_tds[2], user_params_tds[3])}>
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
