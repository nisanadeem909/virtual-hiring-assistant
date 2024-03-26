import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Import 'chart.js/auto' to include all required components

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Reference to the chart instance

  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Values',
            data: Object.values(data),
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Background color of bars
            borderColor: 'rgba(54, 162, 235, 1)', // Border color of bars
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false // Hide legend
            }
          },
          scales: {
            y: {
              type: 'linear', // Use linear scale
              beginAtZero: true,
              max: 100, // Set maximum y-value to 100
              grid: {
                display: true, // Show grid lines
                color: 'rgba(0, 0, 0, 0.1)' // Grid line color
              },
              ticks: {
                font: {
                  size: 14, // Font size for y-axis labels
                  weight: 'bold' // Font weight for y-axis labels
                },
                color: 'rgba(0, 0, 0, 0.7)' // Font color for y-axis labels
              }
            },
            x: {
              ticks: {
                font: {
                  size: 14, // Font size for x-axis labels
                  weight: 'bold' // Font weight for x-axis labels
                },
                color: 'rgba(0, 0, 0, 0.7)' // Font color for x-axis labels
              }
            }
          }
        }
      });
    }
  }, [data]);

  return <canvas ref={chartRef} style={{height: "25vh", "margin-left":"-5vh"}}/>;
};

export default BarChart;
