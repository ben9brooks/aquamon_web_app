import { GlobalStyle } from './styles/GlobalStyle'
import { useState, useEffect } from 'react';

interface Sensors {
  temp: number;
  ph: number;
  tds: number;
}

const dummy: Sensors = {
  temp: 999,
  ph: 999,
  tds: 999
};

async function fetchSensorData(): Promise<Sensors> {
  const addr = 'http://192.168.0.175/sensors';
  try {
    console.log("fetching", addr);
    const response = await fetch(addr);
    console.log("response", response);
    if( response.status >= 200 && response.status < 300 ) {
      const data = await response.json(); 
      console.log("returning data and setting sensor var", data);
      return data;
    }
  } catch (e) {
    console.log("Error:", e);
  }
  return dummy;
}

function getSensorClasses(val: number, warn_min: number, warn_max: number, hard_min: number, hard_max: number): string {
  let classes = "square ";
  if ( val == -1 ) {
    classes += "black";
  } else if (val <= hard_min || val >= hard_max ) {
    classes += "red";
  } else if (val <= warn_min || val >= warn_max ) {
    classes += "yellow"
  } else {
    classes += "green"
  }
  return classes
}

function Sensors() {
  const [sensor, setSensorData] = useState<Sensors>(dummy);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchSensorData();
        setSensorData(data);
      } catch (error) {
        console.log("got error while fetching", error);
        // setError(error.message);
      }
    }
    fetchData();

    // set to call itself at 5 second intervals
    const intervalId = setInterval(fetchData, 5000);  

    return () => clearInterval(intervalId); // removes interval if sensor isn't rendered
  }, []);


  if (sensor) {
    return (
      <div className='sensor-row'>
        <div className={getSensorClasses(sensor.temp, 50, 80, 40, 90)}>
          <p>{sensor.temp}</p>
        </div>

        <div className={getSensorClasses(sensor.ph, 50, 80, 40, 90)}>
          <p>{sensor.ph}</p>
        </div>

        <div className={getSensorClasses(sensor.tds, 50, 80, 40, 90)}>
          <p>{sensor.tds}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Cannot fetch sensor data...</p>
      </div>
    )
  }
}



export function App() {
  return (
    <>
      <GlobalStyle />
      <Sensors />
    </>
  )
}