import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = (props) => {

    const [data,setData] = useState({
        labels: ['Loading'],
        datasets: [
          {
            label: 'Number of Applicants',
            data: [0],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });

      useEffect(()=>{
        if (props.job && props.job._id){

            var param = { 'job': props.job };
            axios.post("http://localhost:8000/komal/getJobApplicationStatistics", param)
                .then((response) => {
                    //alert(JSON.stringify(response.data))
                    if (response.data.status === "success") {
                        setData({
                            labels: ['Total Applicants', 'CVs Matched', 'Forms Accepted', 'Uploaded Video', 'Attempted Test', 'Total Shortlisted'],
                            datasets: [
                              {
                                label: 'Number of Applicants',
                                data: response.data.statistics,
                                backgroundColor: 'rgba(0, 120, 215, 0.2)',
                                borderColor:  'rgba(0, 120, 215, 1)',
                                borderWidth: 1,
                              },
                            ],
                          });
                    } else {
                        console.error("Error: " + response.data.error);
                        setData({
                            labels: ['Total Applicants', 'CVs Matched', 'Forms Accepted', 'Uploaded Video', 'Attempted Test', 'Total Shortlisted'],
                            datasets: [
                              {
                                label: 'Number of Applicants',
                                data: [0],
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                              },
                            ],
                          });
                    }
                })
                .catch(function (error) {
                    console.error("Axios Error:" + error);
                    setData({
                        labels: ['Something went wrong'],
                        datasets: [
                          {
                            label: 'Number of Applicants',
                            data: [0],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                          },
                        ],
                      })
                });

            
        }
      },[props.job])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overall Candidate Progression',
      },
    },
  };

  return <Bar data={data} options={options}/>;
};

export default BarChart;
