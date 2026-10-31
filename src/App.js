import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DonateFood from './pages/DonateFood';
import ReceiveFood from './pages/ReceiveFood';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Rewards from './pages/Rewards';
import Profile from "./pages/Profile";
import VolunteerListPage from "./pages/VolunteerListPage";
import VolunteerProfilePage from "./pages/VolunteerProfilePage";

function App() {
  return (
    <div className="min-h-screen bg-[#FFF8DC]">
  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donate" element={<DonateFood />} />
          <Route path="/receive" element={<ReceiveFood />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/receiver" element={<NGODashboard />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/volunteer-list" element={<VolunteerListPage />} />
          <Route path="/volunteer-profile/:id" element={<VolunteerProfilePage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
