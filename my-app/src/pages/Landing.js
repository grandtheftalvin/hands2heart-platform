// File: client/src/pages/Landing.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import sampleImage from '../assets/WhatsApp Image 2025-06-18 at 22.59.20_8454668f.jpg';

function Landing() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="text-center p-16">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Hands2Heart</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
          Connecting special needs schools with donors, partners, and supporters to showcase and support creativity.
        </p>
        <img
          src={sampleImage}
          alt="Sample showcase"
          className="w-full max-w-lg mx-auto rounded shadow mb-6"
        />
        <div className="space-x-4">
          <a href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow">
            Sign Up
          </a>
          <a href="/login" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow">
            Login
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
