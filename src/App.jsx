import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react'; // TAMBAHAN IMPORT
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jadwal from './pages/Jadwal';
import Doa from './pages/Doa'; 
import Rekap from './pages/Rekap'; 
import Leaderboard from './pages/Leaderboard';

function App() {
  // EFEK GLOBAL UNTUK MENGINGAT DARK MODE DI SEMUA HALAMAN
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/rekap" element={<Rekap />} />
        <Route path="/doa" element={<Doa />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;