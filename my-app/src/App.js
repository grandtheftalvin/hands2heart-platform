// File: client/src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardDonor from './pages/DashboardDonor';
import DashboardInstructor from './pages/DashboardInstructor';
import DashboardAdmin from './pages/DashboardAdmin';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;