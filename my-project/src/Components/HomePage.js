import React from 'react';
import './HomePage.css';
import home from './finalhome.png';
import home2 from './homep3.svg';
import home3 from './why.svg';
import Slideshow from './Slideshow';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate=useNavigate();
  return (
    <div>
      <div className="container-home">
        <div className="box1">
          <h2 className='nisa-homeh'>Let Automation Elevate Your Recruiting Game!</h2>
          <div className='nisa-box1'>
            <button className="b1" onClick={()=>navigate("/login")}>Login</button>
            
          </div>
          <div className="l">
           
          </div>
        </div>

        <div className="box2">
          <img className="img1" src={home2} alt="" />
        </div>
      </div>

      <div className="service">
        <div className="box3">
          
            <div id="nab-discover-opp">Phase-1 CV Screening</div>
          <div id="nab-text">Easily browse and filter through options that match your skills, experience, and preferences</div>
         
        </div>
        <div className="box4">
         
          <div id="nab-discover-opp">Phase-2 Form Screening</div>
          <div id="nab-text">Applying for jobs has never been easier through our CV Maker.</div>
           
          
          
        </div>
        <div className="box5">
         
          
          <div id="nab-discover-opp">Phase-3 Video Interview</div>
          <div id="nab-text">With our streamlined hiring process, companies can find and compare applicants</div>
           
        </div>

        <div className="box6">
         
          
          <div id="nab-discover-opp">Phase-4 Technical Test</div>
          <div id="nab-text">With our streamlined hiring process, companies can find and compare applicants</div>
           
        </div>
      </div>

      <div className='nisa-choose'>
        <div>
      <img className="nisa-img1" src={home3} alt="" />
      </div>
      <div className='nisa-text'>
      <h1>Why should people choose VHA services?</h1>
      <div className="container">
      <div class="vertical-line"></div>
        <div className="circle-wrapper">
          <div className="circle"></div>
          <p className='nisa-details-text'>A Consolidated Platform for Recruitment</p>
        </div>
        <div className="circle-wrapper">
          <div className="circle"></div>
          <p className='nisa-details-text'>A Time Saving and Resource Efficient Platform</p>
        </div>
        <div className="circle-wrapper">
          <div className="circle"></div>
          <p className='nisa-details-text'>A Solution to bulk hiring hectic processes</p>
        </div>
      </div>
    </div>

      </div>

      <div className="ft">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
