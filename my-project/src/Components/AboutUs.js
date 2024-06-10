import React from 'react' 
import './AboutUs.css';
import Footer from './Footer'
import logo from './vhalogo.png';

export default function ViewApp() {

    return (
      <div className='kaboutus-container'>
          <div className='kaboutus-main'>
            <div className='kaboutus-section'>
                <img src={logo} className='kaboutus-logo'></img>
                <label className='kaboutus-title'>Virtual Hiring Assistant</label>
                <hr className='kaboutus-hr'></hr>
                <p className='kaboutus-paragraph'>Revolutionizing recruitment with an integrated platform, saving time and enhancing candidate experiences.</p>
            </div>
          </div>
          <div className='kaboutus-footer'>
            <Footer/>
          </div>

      </div>
    )
  }