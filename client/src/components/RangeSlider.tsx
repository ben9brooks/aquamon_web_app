import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';

  function valuetext(value: number) {
    return `${value}°C`;
  }

  interface RangeSliderProps {
    sensor: string;
    value: number[]; 
    onChange: (newValue: number[]) => void; // Callback function for value change
    inverted: boolean;
    minBound: number;
    maxBound: number;
    step: number;
  }

  interface SliderData {
    temp_warn_min: number;
    temp_warn_max: number;
    temp_alert_min: number;
    temp_alert_max: number;
    ph_warn_min: number, 
    ph_warn_max: number,
    ph_alert_min: number, 
    ph_alert_max: number,
    tds_warn_min: number, 
    tds_warn_max: number,
    tds_alert_min: number, 
    tds_alert_max: number
  }

  

export default function RangeSlider({ sensor, value, onChange, inverted, minBound, maxBound, step }: RangeSliderProps) {
  const [init, setInit] = useState<number[]>([40, 60]); // Use state to store the range
  const [error, setError] = useState<string | null>(null); // State to handle errors
  const fetchSliderData = async (): Promise<SliderData[] | null> => {
    try {
      const response = await fetch('http://localhost:5001/user-parameters/0'); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: SliderData[] = await response.json(); // Ensure this matches your data structure
      return data; // Return the parsed JSON data
    } catch (error) {
      console.error('Error fetching data:', error);
      return null; // Return an empty array or handle the error as needed
    }
  }


  // let init: number[] = [40, 60];
  // const data = fetchSliderData();

  // Using the fetch function
  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchSliderData();
      if (data) { // Check if data is available
        switch (sensor) {
          case "temp-green":
            setInit([data[0].temp_warn_min, data[0].temp_warn_max]);
            break;
          case "temp-yellow":
            setInit([data[0].temp_alert_min, data[0].temp_alert_max]);
            break;
          case "ph-green":
            setInit([data[0].ph_warn_min, data[0].ph_warn_max]);
            break;
          case "ph-yellow":
            setInit([data[0].ph_alert_min, data[0].ph_alert_max]);
            break;
          case "tds-green":
            setInit([data[0].tds_warn_min, data[0].tds_warn_max]);
            break;
          case "tds-yellow":
            setInit([data[0].tds_alert_min, data[0].tds_alert_max]);
            break;
          default:
            console.warn('Unknown sensor type');
        }
      } else {
        console.warn('No data available');
      }
    };

    initializeData(); // Call the async function
  }, [sensor]); // Re-run if `sensor` changes

  // console.log('fetched init', init)
  // const [value, setValue] = React.useState<number[]>(init);
  
  const handleChange = (event: Event, newValue: number[]) => {
    // change if the change is within the props' bounds. If so, change. Else, clamp to that edge.
    // let curMin = 
    if (newValue[1] > maxBound ) {
      setInit([newValue[0], maxBound]); 
      onChange([newValue[0], maxBound]);
    } else if (newValue[0] < minBound) {
      setInit([minBound, newValue[1] ]); 
      onChange([minBound, newValue[1] ]);
    } else{
      setInit(newValue as number[]); //handles visual sliding
      onChange(newValue as number[]);
    }
  };

  if (inverted) {
    return (
      <Box sx={{ width: 300 }}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={init}
          min={minBound}
          max={maxBound}
          step={step}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          track='inverted'
          sx={{
            // color: 'primary.main', // Change the color of the slider
            color: 'red', 
            '& .MuiSlider-rail': {
              backgroundColor: 'red', // Rail color
            },
            '& .MuiSlider-track': {
              backgroundColor: '#ff9b94', // Track color
            },
          
          }}
        />
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: 300 }}>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={init}
          min={minBound}
          max={maxBound}
          step={step}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          sx={{
            // color: 'primary.main', // Change the color of the slider
            color: 'green', // Change the color of the slider
            // '& .MuiSlider-thumb': {
            //   backgroundColor: 'secondary.main', // Thumb color
            // },
            // '& .MuiSlider-track': {
            //   backgroundColor: 'success.main', // Track color
            // },
            '& .MuiSlider-rail': {
              backgroundColor: 'green', // Rail color
            },
          }}
        />
      </Box>
    );
  }
}