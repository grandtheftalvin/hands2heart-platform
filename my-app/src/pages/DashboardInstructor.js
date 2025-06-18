// File: client/src/pages/DashboardInstructor.js
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function DashboardInstructor() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-semibold text-blue-800">Instructor Dashboard</h2>
        <p className="text-gray-700 mt-2">Welcome! Here you can upload artefacts and view donations for your school.</p>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardInstructor;