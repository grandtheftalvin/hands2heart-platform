import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Landing.css'; // <-- Import the CSS
 import givingHand from '../pages/orange-hand.jpg';// Adjust the path as necessary
 import specialkid9 from '../pages/specialkid9.jpg';
 import specialkid8 from '../pages/specialkid8.jpeg';
  import specialkid7 from '../pages/specialkid7.jpg';
   import specialkid6 from '../pages/specialkid6.jpeg';

function Landing() {
  return (
    <div className="landing-container">
      <Navbar />
      <main className="main-content">
        <div className= "head-content">
        <h1 className="main-heading">Hands2Heart</h1>
        <p className="main-paragraph">
          Connecting special needs schools with donors, partners, and supporters, our platform provides 
          a space to showcase and support the creativity of learners with special needs. 
          By bridging this gap, we foster inclusion, awareness, and meaningful opportunities for collaboration and impact.
        </p>
        <p className="main-paragraph">
          Join us in making a difference in the lives of learners with special needs.
        </p>
        </div>
        
         <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
          </div>
     <h3 className="About-Us">About Us</h3>
      <div className="first-section">
        <img src={specialkid9} alt="Special needs student" className="special-kid-image" />
        <p className="first-section-text">
          Hands2Heart is a platform that gives visibility to beautiful handicrafts made by children with special needs.
          These talented learners often lack access to markets due to limited exposure — we help bridge that gap.
          By showcasing their work, we connect them with buyers, donors, and supporters who believe in creativity, inclusion, and impact.
        </p>
          
      </div>
      

      <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
     </div>

      <h3 className="About-Us">How it works</h3>

      <div className="logo-section">
            <img src={givingHand} alt="Giving hand logo" className="giving-hand-logo" />
     </div>

      <h3 className="About-Us">The Change it Makes</h3>
      
        
      </main>
      
      <Footer />
    </div>
  );
}

export default Landing;
