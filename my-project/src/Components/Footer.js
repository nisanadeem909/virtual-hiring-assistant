import React from 'react';
import './Footer.css';
import logo1 from './vhalogo.png';
import icons from './icons.png';

export default function Footer() {
  return (
    <div>
       <footer class="footer-distributed">

<div class="footer-left">

<img class="logo" src={logo1}/>
  
</div>

<div class="footer-center">

  <div>
    <i class="fa fa-map-marker"></i>
    <p><span>Looking for a job?</span>Looking for an employee?</p>
  </div>

  <div>
    <i class="fa fa-phone"></i>
    <p>You came to the right place!</p>
  </div>

  <div>
    <i class="fa fa-envelope"></i>
    <p><a href="mailto:support@jobify.com">support@vha.com</a></p>
  </div>

</div>

<div class="footer-right">

  <p class="footer-company-about">
    <span>About VHA</span>
    VHA: Your ultimate destination for finding the perfect job. Discover, search, and apply for a wide range of career opportunities in various industries, connecting job seekers with their dream positions.
  </p>

  <div class="footer-icons">

    <img className='icons' src={icons} alt="" />

  </div>

</div>

</footer>
      
    </div>
  )
}
