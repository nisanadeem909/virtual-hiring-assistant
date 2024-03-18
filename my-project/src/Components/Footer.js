import React from 'react';
import './Footer.css';
import logo1 from './vhalogo.png';
import icons from './icons.png';

export default function Footer() {
  return (
    <div>
      <footer className="footer-distributed">

        <div className="footer-left">
          <img className="logo" src={logo1} alt="VHA Logo" />
        </div>

        <div className="footer-center">
          <div>
            <i className="fa fa-map-marker"></i>
            <p><span>Explore Easy Hiring</span>Looking for the right employee?</p>
          </div>
          <div>
            <i className="fa fa-phone"></i>
            <p>Your perfect match is here!</p>
          </div>
          <div>
            <i className="fa fa-envelope"></i>
            <p><a href="mailto:virtualhiringassistant04@gmail.com">virtualhiringassistant04@gmail.com</a></p>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-company-about">
            <span>About VHA</span>
            VHA: Empowering recruiters to streamline and optimize the hiring process. Revolutionize your recruitment journey by discovering, connecting, and efficiently hiring top talent. Explore a plethora of career opportunities in various industries, ensuring a seamless match between recruiters and qualified candidates.
          </p>

          
        </div>

      </footer>
    </div>
  )
}
