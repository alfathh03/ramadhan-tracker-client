import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jadwal from './pages/Jadwal';
import Doa from './pages/Doa'; // PANGGIL FILE DOA
// Tambahkan di deretan import atas
import Rekap from './pages/Rekap'; 

// Tambahkan di dalam <Routes>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/rekap" element={<Rekap />} />
        {/* Rute baru untuk Kumpulan Doa */}
        <Route path="/doa" element={<Doa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;