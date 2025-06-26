// File: client/src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardDonor from './pages/DashboardDonor';
import DashboardInstructor from './pages/DashboardInstructor';
import DashboardAdmin from './pages/DashboardAdmin';
import VerifyEmail from './pages/VerifyEmail';
import DonorArtefactlist from './pages/DonorArtefactlist'; 
import InstructorArtefactList from './pages/InstructorArtefactList';
import DonorBidForm from './pages/DonorBidForm';
import DonorMyBids from './pages/DonorMyBids';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/donor" element={<DashboardDonor />} />
        <Route path="/dashboard/instructor" element={<DashboardInstructor />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
         <Route path="/donor/artefacts" element={<DonorArtefactlist />} />
        <Route path="/instructor/artefacts" element={<InstructorArtefactList />} />
        <Route path="/donor/bid/:id" element={<DonorBidForm />} />
        <Route path="/donor/my-bids" element={<DonorMyBids />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;