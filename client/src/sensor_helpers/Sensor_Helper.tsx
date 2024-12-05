import React from 'react'
import { ChartConfiguration, ChartTypeRegistry } from 'chart.js';

type useState_setter_number = React.Dispatch<React.SetStateAction<number>>;
type useState_setter_number_arr = React.Dispatch<React.SetStateAction<number[]>>;
type useState_setter_chart = React.Dispatch<React.SetStateAction<{ x: number; y: number }[]>>;
type useState_setter_boolean = React.Dispatch<React.SetStateAction<boolean>>;
type ChartPoint = { x: number; y: number };
type ColorArray = string[];
type MakePointFillColors = (
    chartData: ChartPoint[], 
    sliderValueAlert: number[], 
    sliderValueWarn: number[],
    color_one: string,
    color_two: string,
    color_three: string
  ) => ColorArray;


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
export class SliderDataConstructor implements SliderData {
    temp_warn_min: number;
    temp_warn_max: number;
    temp_alert_min: number;
    temp_alert_max: number;
    ph_warn_min: number;
    ph_warn_max: number;
    ph_alert_min: number;
    ph_alert_max: number;
    tds_warn_min: number;
    tds_warn_max: number;
    tds_alert_min: number;
    tds_alert_max: number;
  
    constructor(
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
    ) {
      this.temp_warn_min = temp_warn_min;
      this.temp_warn_max = temp_warn_max;
      this.temp_alert_min = temp_alert_min;
      this.temp_alert_max = temp_alert_max;
      this.ph_warn_min = ph_warn_min;
      this.ph_warn_max = ph_warn_max;
      this.ph_alert_min = ph_alert_min;
      this.ph_alert_max = ph_alert_max;
      this.tds_warn_min = tds_warn_min;
      this.tds_warn_max = tds_warn_max;
      this.tds_alert_min = tds_alert_min;
      this.tds_alert_max = tds_alert_max;
    }
  }



export const make_time_title = (sensorType: string, timeFrame: string) => {
    return `${sensorType} Over the Last ${timeFrame}`;
}

async function get_parameter_value(userId: number, name: string): Promise<number> {
    const response = await fetch(`http://localhost:5001/user-parameters/${userId}/${name}`);
    const data = await response.json();
    return data[0][name];
}

const fetch_slider_data = async (sensorType: string, 
    warn_slider_setter: useState_setter_number_arr, 
    alert_slider_setter: useState_setter_number_arr) => 
    {
    try {
      const warnMin = await get_parameter_value(0, `${sensorType}_warn_min`);
      const warnMax = await get_parameter_value(0, `${sensorType}_warn_max`);
      const alertMin = await get_parameter_value(0, `${sensorType}_alert_min`);
      const alertMax = await get_parameter_value(0, `${sensorType}_alert_max`);
      warn_slider_setter([warnMin, warnMax]);
      alert_slider_setter([alertMin, alertMax]);
    } catch (error) {
      console.error('Error fetching slider values:', error);
    }
};

export const fetch_slider_then_graph_data = async (
    sensorType: string, 
    setMaxY: useState_setter_number, 
    setMinY: useState_setter_number, 
    setChartData: useState_setter_chart, 
    setReloadGraph: useState_setter_boolean, 
    reloadGraph: boolean,
    warn_slider_setter: useState_setter_number_arr, 
    alert_slider_setter: useState_setter_number_arr
    ) => {
    // Fetch slider values first
    await fetch_slider_data(sensorType, warn_slider_setter, alert_slider_setter);
    // Then fetch other data
    fetch_graph_data(sensorType, setMaxY, setMinY, setChartData, setReloadGraph, reloadGraph);
};


export async function fetch_graph_data(sensorType: string, 
    setMaxY: useState_setter_number, 
    setMinY: useState_setter_number, 
    setChartData: useState_setter_chart, 
    setReloadGraph: useState_setter_boolean, 
    reloadGraph: boolean)
    {
    const response = await fetch(`http://localhost:5001/${sensorType}-data`) // Assuming you have a backend route for this
    const data = await response.json()

    // fill in formatted data based on sensor type
    let formattedData = [];
    if (sensorType == "temp") {
        formattedData = data.map((item: { temp: number, timestamp: number }) => ({
            x: new Date(item.timestamp),
            y: item.temp,
        }))

    } else if (sensorType == "ph") {
        formattedData = data.map((item: { ph: number, timestamp: number }) => ({
            x: new Date(item.timestamp),
            y: item.ph,
        }));
    } else {
        formattedData = data.map((item: { tds: number, timestamp: number }) => ({
            x: new Date(item.timestamp),
            y: item.tds,
        }));
    }

    let localMinY = Infinity;
    let localMaxY = -Infinity;

    for (let i = 0; i < formattedData.length; i++) {
        let val = formattedData[i].y;

        // Update minval if the current valerature is lower
        if (val < localMinY) {
        localMinY = val;
        }

        // Update maxval if the current valerature is higher
        if (val > localMaxY) {
        localMaxY = val;
        }
    }

    // round max up to the next 5 and min to the bottom 5.
    localMaxY = Math.floor(localMaxY / 5) * 5;
    localMaxY = localMaxY + 5;
    localMinY = Math.floor(localMinY / 5) * 5;
    localMinY = localMinY - 5;  
    setMaxY(localMaxY);
    setMinY(localMinY);

    setChartData(formattedData);
    setReloadGraph(!reloadGraph);
}

export const make_colors: MakePointFillColors = (chart_data, sliderValueAlert,sliderValueWarn, color_one, color_two, color_three) => {
    return chart_data.map(point => {
        if (point.y < sliderValueAlert[0] || point.y > sliderValueAlert[1]) {
            return color_one; // Red fill for out of range
        } else if (point.y > sliderValueWarn[0] && point.y < sliderValueWarn[1]) {
            return color_two; // Green fill for boundary
        }
        return color_three; // Yellow fill for in range
    });
}

const make_slider_constructor_with_sensor = (sensorType: string, data_one: number, data_two: number, data_three: number, data_four: number) => {
    // data one and two are dataWarn [0] and [1], data three and four are dataAlert [0] and [1].
    if (sensorType == "temp") {
        return new SliderDataConstructor(data_one, data_two, data_three, data_four, -100, -100, -100, -100, -100, -100, -100, -100);
    } else if (sensorType == "ph") {
        return new SliderDataConstructor(-100, -100, -100, -100, data_one, data_two, data_three, data_four, -100, -100, -100, -100);
    } else if (sensorType == "tds"){
        return new SliderDataConstructor(-100, -100, -100, -100, -100, -100, -100, -100, data_one, data_two, data_three, data_four);
    } else {
        console.warn('Unknown sensor type - calling make_slider_constructor_with_sensor for', sensorType);
    }
}

export const upload_parameters = async (sensorType: string, userId: number, updatedDataWarn: number[], updatedDataAlert: number[] ): Promise<void> => {
    const newJohn = make_slider_constructor_with_sensor(sensorType, updatedDataWarn[0], updatedDataWarn[1], updatedDataAlert[0], updatedDataAlert[1]);
    console.log("submit press", newJohn);
    console.log(JSON.stringify(newJohn)); 
    try {
      const response = await fetch(`http://localhost:5001/upload-user-parameters/${userId}`, {
        method: 'PUT', // Specify the method
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(newJohn), // Convert the data to JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json(); // If you expect a response body
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Error updating user parameters:', error);
    }
}

export const make_graph_config = (
    chartData: useState_setter_chart,
    pointFillColors: ColorArray,
    pointBorderColors: ColorArray,
    timeUnit: string,
    timeMin: number,
    timeMax: number,
    minY: number,
    maxY: number,
    graphTitle: string) => 
    {
    const dataset = {
        label: 'Temperature',
        data: chartData,
        borderWidth: 1,
        borderColor: 'black',
        pointBackgroundColor: pointFillColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        fill: false,
    };
  
    const data = {
        datasets: [dataset],
    };

    return {
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
              },
              min: timeMin,
              max: timeMax,
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Temperature'
              },
              min: minY,
              max: maxY,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: graphTitle
            }
          }
        },
    };
}

export function create_chart_config(
    chartData: { x: number; y: number }[],
    pointFillColors: string[],
    pointBorderColors: string[],
    timeUnit: string,
    timeMin: string | number | undefined,
    timeMax: string | number | undefined,
    minY: number,
    maxY: number,
    graphTitle: string
  ): ChartConfiguration<'line', { x: number; y: number }[], unknown> {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Temperature',
            data: chartData,
            borderWidth: 1,
            borderColor: 'black',
            pointBackgroundColor: pointFillColors,
            pointBorderColor: pointBorderColors,
            pointBorderWidth: 2,
            fill: false,
          },
        ],
      },
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
            },
            min: timeMin,
            max: timeMax,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Temperature',
            },
            min: minY,
            max: maxY,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: graphTitle,
          },
        },
      },
    };
  }

// export const mock_data = async(
//     sensorType: string,
//     temp_min: number,
//     temp_max: number,
//     interval_min: number,
//     time_frame: number) => 
//     {
//     try {
//       const response = await fetch(`http://localhost:5001/mock/${sensorType}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify([temp_min, temp_max, interval_min, time_frame]),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error while trying to mock data! Status: ${response.status}`);
//       }

//       console.log("Mock data successful");
//     } catch {
//       console.log("Error while contacting back end to mock data");
//     }
//   };