import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Landing.css'; // <-- Import the CSS
 import givingHand from '../pages/orange-hand.jpg';// Adjust the path as necessary
import pagescroll1 from '../pages/scroll2.jpeg';  
import pagescroll2 from '../pages/scroll3.jpeg';
import pagescroll3 from '../pages/scroll4.jpeg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
  

function Landing() {
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <div className="landing-container">
      <Navbar />
      <main className="main-content">
        <div className= "head-content">
          <h1 className="main-heading">Hands2Heart</h1>
          <div className="readmore">
            <button className="readmore-button" onClick={() => { document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' }); }}>Read More</button>
          </div>
        </div>
         <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
          </div>

        <div className="About-Us" id="about-us" data-aos="fade-up">
          <h3 className="About-Us-Heading">About Us</h3>

          <div className="About-Us-Content">
            <div className="first-section">
              <img src={pagescroll1} alt="Special needs student" className="special-kid-image" />
            </div>
              <div className="first-section-text">
                <p>
                  Hands2Heart is a platform that gives visibility to beautiful handicrafts made by children with special needs.
                  These talented learners often lack access to markets due to limited exposure — we help bridge that gap.
                  By showcasing their work, we connect them with buyers, donors, and supporters who believe in creativity, inclusion, and impact.
                </p>
              </div> 
            
          </div>   
        </div>
          
      
      

      <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
     </div>

      <div className="About-Us"  data-aos="fade-up">
          <h3 className="About-Us-Heading">How it works</h3>

          <div className="About-Us-Content">
              <div className="first-section-text">
                <p>
                  Hands2Heart connects special needs schools with donors and supporters by showcasing unique handmade products created by children with special needs. 
                  Through our platform, these items are featured in a digital marketplace where donors can place bids. 
                  The highest bids are then used to support the children helping fund their education, provide materials, and improve school facilities all while celebrating their creativity and talent.
                </p>
              </div> 
              <div className="first-section">
              <img src={pagescroll2} alt="Special needs student" className="special-kid-image" data-aos="fade-up" />
            </div>
          </div>   
        </div>
      

      <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
     </div>

      <div className="About-Us"  data-aos="fade-up">
        <div className="About-Us-Content">
          <h3 className="About-Us-Heading">The Change it Makes</h3>
            <div className="first-section">
              <img src={pagescroll3} alt="Special needs student" className="special-kid-image" data-aos="fade-up" />
            </div>
          
              <div className="first-section-text">
                <p>
                  Your support goes beyond a simple donation. 
                  Every bid contributes to building confidence, dignity, and opportunity for these amazing children. 
                  Schools receive vital resources, classrooms are renovated, and learners are empowered through the value placed on their work. 
                  It's not just about giving, it's about recognizing talent, fostering inclusion, and making a lasting impact in the lives of children who deserve to shine.
                </p>
              </div> 
              
        </div>   
      </div>
      
        
      </main>
      
      <Footer id = "contact"/>
    </div>
  );
}

export default Landing;
