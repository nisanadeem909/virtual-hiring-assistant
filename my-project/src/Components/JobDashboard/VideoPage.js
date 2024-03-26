import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import aicon from './aiicon.jpg'
import './videofile.css'
import Footer from '../Footer';

function TraitSlider({ name, score, accepted }) {
  const getColorForScore = (score) => {
    // Define different color gradients based on the score
    let color1, color2;

    if (!accepted) {
      // If not accepted, set color to red gradient
      color1 = 'hsl(0, 70%, 80%)'; // Light red
      color2 = 'hsl(0, 100%, 40%)'; // Dark red
    // } else if (score <= 1.5) {
    //   color1 = 'hsl(240, 60%, 80%)'; // Light blue
    //   color2 = 'hsl(240, 100%, 40%)'; // Dark blue
    // } else if (score <= 3.5) {
    //   color1 = 'hsl(240, 60%, 80%)'; // Light purple
    //   color2 = 'hsl(240, 100%, 40%)'; // Dark purple
    } else {
      color1 = 'hsl(240, 60%, 80%)'; // Light blue
      color2 = 'hsl(240, 100%, 40%)'; // Dark blue
    }

    // Apply the gradient based on the score
    const gradientColor = `linear-gradient(to right, ${color1}, ${color2} ${(score / 5) * 100}%, transparent ${(score / 5) * 100}%)`;

    return gradientColor;
  };

  const thumbColor = getColorForScore(score);

  const inputStyle = {
    width: '100%',
    height: '10px',
    appearance: 'none',
    background: '#ddd', // Gray background for the slider track
    borderRadius: '5px',
    outline: 'none',
    marginTop: '5px',
    marginBottom:'10px',
    position: 'relative',
  };
  const inputStyle2 = {
    width: '100%',
    height: '10px',
    appearance: 'none',
    borderRadius: '25px',
    marginTop: '5px',
   
    border: '10px solid #ccc', // Outline around the slider
  };
  const thumbStyle = {
    width: '20px',
    height: '20px',
    backgroundColor: thumbColor, // Thumb color matches the gradient
    borderRadius: '50%',
    cursor: 'pointer',
    position: 'absolute',
    top: '-15px',
    left: `calc(${(score / 5) * 100}% - 10px)`, // Adjust thumb position based on score
    transform: 'translateX(-50%)',
  };

  return (
    <div className="trait-slider">
      <label>{name}</label>

      <div style={{inputStyle2}}>
        <input
          type="range"
          min="0"
          max="5"
          value={score}
          readOnly
          className='k-video-traitslider'
          style={{ ...inputStyle, background: getColorForScore(score) }}
        />
      </div> {/* Apply the gradient */}
    </div>
  );
}


  
  
const VideoPage = ({ email, videoUrl, traitScores }) => {
  const location = useLocation();
 

  return (
    <>
    <div className="nab-video-page-container">
        <h3 style={{ textAlign: 'center' }}>Video Interview for Applicant {location.state.applicantInfo}</h3>
        <div className="content-container" style={{marginTop:'15px',paddingTop:'5px'}}>
            <div className="nisa-image-container" style={{marginLeft:'5px',height:'70vh',marginTop:'2px', borderRight: '1px solid #ccc' }}>
            <div className="video-container">
                {/* {alert(location.state.videoUrl)} */}
                <video controls style={{ width: '100vh', height: '65vh' }}>
                <source src={location.state.videoUrl}  />
                Your browser does not support the video tag.
                </video>
            </div>
            </div>
            <div className="nab-video-container">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={aicon} style={{ width: '50px', height:'39px',marginLeft: '10vh' }} />
                <h3>AI Video Analysis</h3>
            </div>

                <br></br>
                <br></br>
                <div>
                    {/* {alert(location.state.videoUrl)} */}
                    {location.state.traitScores.map((trait, index) => (
                    <TraitSlider key={index} name={trait.trait+" ("+trait.score.$numberDecimal+")"} score={trait.score.$numberDecimal} accepted={trait.accepted} />
                    ))}
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</>

  );
};

export default VideoPage;
