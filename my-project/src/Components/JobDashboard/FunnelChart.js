import React, { useEffect, useState } from 'react';
import { CanvasJSChart } from 'canvasjs-react-charts';
import axios from 'axios';

const FunnelChart = (props) => {
    const [options, setOptions] = useState({
        animationEnabled: true,
        title: {
            text: "Overall Candidates Progression",
            fontFamily: "Helvetica",
            fontSize: 20
        },
        backgroundColor: "transparent",
        data: [{
            type: "funnel",
            indexLabel: "{label} - {y}",
            toolTipContent: "<b>{label}</b>: {y}%",
            dataPoints: [
                { y: 0, label: "Loading" }
            ]
        }]
    });

    useEffect(()=>{
        if (props.job && props.job._id){

            var param = { 'job': props.job };
            axios.post("http://localhost:8000/komal/getJobApplicationStatistics", param)
                .then((response) => {
                    //alert(JSON.stringify(response.data))
                    if (response.data.status === "success") {
                        setOptions({
                            animationEnabled: true,
                            title: {
                                text: "Overall Candidates Progression",
                                fontFamily: "Helvetica",
                                fontSize: 20
                            },
                            backgroundColor: "transparent",
                            data: [{
                                type: "funnel",
                                indexLabel: "{label} - {y}",
                                toolTipContent: "<b>{label}</b>: {y}",
                                dataPoints: [
                                    { y: response.data.statistics[0], label: "Total Applications",color: "#013a66" },
                                    { y: response.data.statistics[1], label: "CVs Matched",color:"#005a9e" },
                                    { y: response.data.statistics[2], label: "Forms Accepted",color:"#0078d7" },
                                    { y: response.data.statistics[3], label: "Videos Uploaded",color:"#429ce3" },
                                    { y: response.data.statistics[4], label: "Tests Attempted",color:"#76b9ed" },
                                    { y: response.data.statistics[5], label: "Shortlisted",color:"#a6d8ff" }
                                ]
                            }]
                        });
                    } else {
                        console.error("Error: " + response.data.error);
                       //
                    }
                })
                .catch(function (error) {
                    console.error("Axios Error:" + error);
                    //
                });

            
        }
      },[props.job])

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default FunnelChart;
