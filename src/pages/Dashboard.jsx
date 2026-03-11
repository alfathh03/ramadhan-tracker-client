import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // IMPORT SWEETALERT2

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]); // Default hari ini
    const [stats, setStats] = useState({});
    
    // State form ibadah
    const [formData, setFormData] = useState({
        puasa: false, shalat_subuh: false, shalat_dzuhur: false,
        shalat_ashar: false, shalat_maghrib: false, shalat_isya: false,
        tarawih: false, tadarus_surah: '', tadarus_ayat: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    // Mengambil data setiap kali tanggal diubah
    useEffect(() => {
        if (user) {
            fetchDataHarian();
            fetchRekap();
        }
    }, [user, tanggal]);

    const fetchDataHarian = async () => {
        try {
            const res = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/api/tracker/${user.id}/${tanggal}`);
            if (res.data.data) {
                // Jika sudah ada data di hari itu, masukkan ke form (Untuk fitur Edit)
                setFormData({
                    puasa: res.data.data.puasa === 1,
                    shalat_subuh: res.data.data.shalat_subuh === 1,
                    shalat_dzuhur: res.data.data.shalat_dzuhur === 1,
                    shalat_ashar: res.data.data.shalat_ashar === 1,
                    shalat_maghrib: res.data.data.shalat_maghrib === 1,
                    shalat_isya: res.data.data.shalat_isya === 1,
                    tarawih: res.data.data.tarawih === 1,
                    tadarus_surah: res.data.data.tadarus_surah || '',
                    tadarus_ayat: res.data.data.tadarus_ayat || ''
                });
            } else {
                // Jika belum ada data, kosongkan form
                setFormData({
                    puasa: false, shalat_subuh: false, shalat_dzuhur: false,
                    shalat_ashar: false, shalat_maghrib: false, shalat_isya: false,
                    tarawih: false, tadarus_surah: '', tadarus_ayat: ''
                });
            }
        } catch (error) {
            console.error("Gagal mengambil data harian", error);
        }
    };

    const fetchRekap = async () => {
        try {
            const res = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/api/tracker/rekap/${user.id}`);
            setStats(res.data);
        } catch (error) {
            console.error("Gagal mengambil rekap", error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { user_id: user.id, tanggal, ...formData };
            const res = await axios.post('https://ramadhan-tracker-api-production.up.railway.app/api/tracker', payload);
            
            // POPUP BERHASIL SIMPAN
            Swal.fire({
                icon: 'success',
                title: 'Masyaallah! 🌟',
                text: res.data.message || 'Catatan Ibadah berhasil disimpan!',
                confirmButtonColor: '#10b981' // Warna hijau emerald Tailwind
            });
            
            fetchRekap(); // Update statistik setelah simpan
        } catch (error) {
            // POPUP GAGAL SIMPAN
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan data ibadah! Cek koneksi Anda.',
                confirmButtonColor: '#ef4444' // Warna merah Tailwind
            });
        }
    };

    const handleLogout = () => {
        // Tambahan fitur: Konfirmasi sebelum logout
        Swal.fire({
            title: 'Yakin ingin keluar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('user');
                navigate('/login');
            }
        });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header & Profil */}
                <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center border-l-4 border-emerald-500 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">Halo, {user.nama} 👋</h1>
                        <p className="text-gray-500">Selamat datang di Tracker Ramadhan</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => navigate('/leaderboard')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center">
                            🏆 Leaderboard
                        </button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow transition">
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Statistik Cepat */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow border-t-4 border-emerald-400 text-center">
                        <p className="text-gray-500 text-sm">Total Poin</p>
                        <p className="text-2xl font-bold text-emerald-600">{stats.total_poin || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow border-t-4 border-blue-400 text-center">
                        <p className="text-gray-500 text-sm">Hari Puasa</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.total_puasa || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow border-t-4 border-indigo-400 text-center">
                        <p className="text-gray-500 text-sm">Shalat Wajib</p>
                        <p className="text-2xl font-bold text-indigo-600">{stats.total_shalat_wajib || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow border-t-4 border-purple-400 text-center">
                        <p className="text-gray-500 text-sm">Tadarus Terakhir</p>
                        <p className="text-lg font-bold text-purple-600 truncate">
                            {stats.tadarus_terakhir?.surah || '-'} <br/> <span className="text-sm">(Ayat {stats.tadarus_terakhir?.ayat || '-'})</span>
                        </p>
                    </div>
                </div>

                {/* Form Input Ibadah */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Catat Ibadah</h2>
                        <input 
                            type="date" 
                            value={tanggal} 
                            onChange={(e) => setTanggal(e.target.value)}
                            className="border-2 border-emerald-300 rounded-lg px-3 py-1 focus:outline-none focus:border-emerald-500 font-bold text-gray-700"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Puasa */}
                        <label className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg cursor-pointer">
                            <input type="checkbox" name="puasa" checked={formData.puasa} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                            <span className="font-bold text-gray-700">Puasa Hari Ini</span>
                        </label>

                        {/* Shalat Wajib */}
                        <div>
                            <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Shalat Wajib</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                                    <label key={waktu} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                        <input type="checkbox" name={`shalat_${waktu}`} checked={formData[`shalat_${waktu}`]} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                                        <span className="capitalize text-gray-600">Shalat {waktu}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Tarawih & Tadarus */}
                        <div>
                            <h3 className="font-bold text-gray-700 border-b pb-2 mb-3">Sunnah & Al-Quran</h3>
                            <label className="flex items-center space-x-2 cursor-pointer mb-4 p-2 hover:bg-gray-50 rounded-lg w-fit">
                                <input type="checkbox" name="tarawih" checked={formData.tarawih} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                                <span className="text-gray-600">Shalat Tarawih</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Surah</label>
                                    <input type="text" name="tadarus_surah" value={formData.tadarus_surah} onChange={handleChange} placeholder="Contoh: Al-Baqarah" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Ayat Terakhir</label>
                                    <input type="number" name="tadarus_ayat" value={formData.tadarus_ayat} onChange={handleChange} placeholder="Contoh: 15" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1">
                            💾 Simpan Catatan Ibadah
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}