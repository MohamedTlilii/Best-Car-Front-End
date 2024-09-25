import React, { useState } from 'react';
import './Statistical.scss';
import ApexCharts from 'react-apexcharts';
function ApexChart() {
  const [state, setState] = useState({
    series: [{
      name: 'Sales',
      data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      forecastDataPoints: {
        count: 7
      },
      stroke: {
        width: 5,
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
        tickAmount: 10,
        labels: {
          formatter: function(value , timestamp , opts ) {
            return opts.dateFormatter(new Date(timestamp), 'dd MMM')
          }
        }
      },
      title: {
        text: 'Forecast',
        align: 'left',
        style: {
          fontSize: "16px",
          color: '#666'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [ '#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      }
    },
  });

  return (
    <div>
      <div id="chart">
        <ApexCharts options={state.options} series={state.series} type="line" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

function Statistical() {
  return (
    <div className='statisticalContainer'>
      <h1>Statistical Overview</h1>
      <p>Here you can find various statistical data and insights.</p>
      <div className='content'>
        <ApexChart />
      </div>
    </div>
  );
}



export default Statistical;
