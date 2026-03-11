import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// 1. WAJIB: Import library grafik
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState({});
    
    // 2. WAJIB: State untuk Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [formData, setFormData] = useState({
        puasa: false, shalat_subuh: false, shalat_dzuhur: false,
        shalat_ashar: false, shalat_maghrib: false, shalat_isya: false,
        tarawih: false, tadarus_surah: '', tadarus_ayat: ''
    });

    // Sinkronisasi Tema saat pertama kali load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { user_id: user.id, tanggal, ...formData };
            const res = await axios.post('https://ramadhan-tracker-api-production.up.railway.app/api/tracker', payload);
            
            Swal.fire({
                icon: 'success',
                title: 'Masyaallah! 🌟',
                text: res.data.message || 'Catatan Ibadah berhasil disimpan!',
                confirmButtonColor: '#10b981',
                background: isDarkMode ? '#1f2937' : '#fff',
                color: isDarkMode ? '#fff' : '#000'
            });
            
            fetchRekap(); 
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan data!',
                confirmButtonColor: '#ef4444' 
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // 3. Menyiapkan data untuk Grafik
    const chartData = stats.history ? [...stats.history].reverse().map(item => ({
        tanggal: item.tanggal.slice(8, 10),
        poin: item.poin_harian
    })) : [];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center border-l-4 border-emerald-500 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">Halo, {user.nama} 👋</h1>
                        <p className="text-gray-500 dark:text-gray-400">Selamat datang di Tracker Ramadhan</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-end gap-2 items-center">
                        {/* Tombol Saklar Dark Mode */}
                        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xl">
                            {isDarkMode ? '🌞' : '🌙'}
                        </button>
                        <button onClick={() => navigate('/jadwal')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow">⏰ Jadwal</button>
                        <button onClick={() => navigate('/doa')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow">🤲 Doa</button>
                        <button onClick={() => navigate('/leaderboard')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow">🏆 Peringkat</button>
                        <button onClick={() => navigate('/rekap')} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow">📖 Riwayat</button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow">Keluar</button>
                    </div>
                </div>

                {/* Struktur 2 Kolom untuk Grafik dan Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sisi Kiri: Form Input */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Catat Ibadah</h2>
                                <input 
                                    type="date" 
                                    value={tanggal} 
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="border-2 border-emerald-300 dark:border-emerald-600 rounded-lg px-3 py-1 font-bold text-gray-700 dark:text-white dark:bg-gray-700"
                                />
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <label className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg cursor-pointer">
                                    <input type="checkbox" name="puasa" checked={formData.puasa} onChange={(e) => setFormData({...formData, puasa: e.target.checked})} className="w-5 h-5 text-emerald-600" />
                                    <span className="font-bold text-gray-700 dark:text-gray-200">Puasa Hari Ini</span>
                                </label>
                                {/* ... Sisanya sesuai kode Anda (Shalat Wajib, dll) ... */}
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg">💾 Simpan Catatan Ibadah</button>
                            </form>
                        </div>
                    </div>

                    {/* Sisi Kanan: Grafik & Statistik */}
                    <div className="space-y-6">
                        {/* Kotak Grafik Progres */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">📈 Progres 7 Hari Terakhir</h3>
                            <div className="h-48 w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <XAxis dataKey="tanggal" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="poin" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">Belum ada data progres harian.</div>
                                )}
                            </div>
                        </div>

                        {/* Kartu Statistik Mini */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-emerald-400 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Total Poin</p>
                                <p className="text-xl font-bold text-emerald-600">{stats.total_poin || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-blue-400 text-center">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Hari Puasa</p>
                                <p className="text-xl font-bold text-blue-600">{stats.total_puasa || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}