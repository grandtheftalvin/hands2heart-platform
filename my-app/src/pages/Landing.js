import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Landing.css'; // <-- Import the CSS

function Landing() {
  return (
    <div className="landing-container">
      <Navbar />
      <main className="main-content">
        <h1 className="main-heading">Welcome to Hands2Heart</h1>
        <p className="main-paragraph">
          Connecting special needs schools with donors, partners, and supporters, our platform provides 
          a space to showcase and support the creativity of learners with special needs. 
          By bridging this gap, we foster inclusion, awareness, and meaningful opportunities for collaboration and impact.
        </p>
        <p className="main-paragraph">
          Join us in making a difference in the lives of learners with special needs.
        </p>
        <div className="button-group">
          <a href="/signup" className="btn">Sign Up</a>
          <a href="/login" className="btn">Login</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
