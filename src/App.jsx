import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jadwal from './pages/Jadwal';
import Doa from './pages/Doa'; 
import Rekap from './pages/Rekap'; 
import Leaderboard from './pages/Leaderboard'; // TAMBAHAN: Import halaman Leaderboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Default */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rute Autentikasi */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rute Fitur Utama */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/rekap" element={<Rekap />} />
        <Route path="/doa" element={<Doa />} />
        
        {/* Rute Papan Peringkat */}
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;