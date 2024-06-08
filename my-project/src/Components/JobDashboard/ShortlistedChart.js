import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

const DonutChart = (props) => {
 
    const [data,setData] = useState({
        labels: ['Loading'],
        datasets: [
          {
            data: [0], 
            backgroundColor: ['#f15e5e'],
            hoverBackgroundColor: [ '#f15e5e'],
          },
        ],
      });

      useEffect(()=>{
            if (props.applications && props.applications.length != 0){
                let count5 = 0;
                let countMinus5 = 0;
                let count3 = 0;
        
                props.applications.forEach(application => {
                    if (application.status === 5) {
                        count5++;
                    } else if (application.status === -5) {
                        countMinus5++;
                    } else if (application.status === 3) {
                        count3++;
                    }
                });

                setData({
                    labels: ['Accepted', 'Rejected', 'Neither'],
                    datasets: [
                      {
                        data: [count5, countMinus5, count3], 
                        backgroundColor: [ '#a3d970', '#f15e5e', '#36A2EB'],
                        hoverBackgroundColor: [ '#a3d970', '#f15e5e', '#36A2EB'],
                      },
                    ],
                  })
            }
      },props.applications)

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Shortlisted Candidates Overview', // Chart title
        fontSize: 20,
        fontColor: 'black',
        padding: {
          top: 20,
          bottom: 20
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: 'black',
          fontSize: 14,
          padding: 20,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DonutChart;
