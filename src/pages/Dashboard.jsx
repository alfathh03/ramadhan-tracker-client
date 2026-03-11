import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState({});
    
    // JURUS AMPUH: State tema langsung membaca dari memori browser
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const [formData, setFormData] = useState({
        puasa: false, shalat_subuh: false, shalat_dzuhur: false,
        shalat_ashar: false, shalat_maghrib: false, shalat_isya: false,
        tarawih: false, tadarus_surah: '', tadarus_ayat: ''
    });

    // JURUS AMPUH: Efek ini akan otomatis jalan setiap kali tombol diklik
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    // Fungsi klik yang sangat simpel dan pasti jalan
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
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

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
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
                background: theme === 'dark' ? '#1f2937' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000'
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

    const chartData = stats.history ? [...stats.history].reverse().map(item => ({
        tanggal: item.tanggal.slice(8, 10),
        poin: item.poin_harian
    })) : [];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center border-l-4 border-emerald-500 gap-4 transition-colors">
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">Halo, {user.nama} 👋</h1>
                        <p className="text-gray-500 dark:text-gray-400">Selamat datang di Tracker Ramadhan</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-end gap-2 items-center">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xl flex items-center justify-center w-10 h-10 mr-2 shadow-sm">
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>
                        <button onClick={() => navigate('/jadwal')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow">⏰ Jadwal</button>
                        <button onClick={() => navigate('/doa')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow">🤲 Doa</button>
                        <button onClick={() => navigate('/leaderboard')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold shadow">🏆 Peringkat</button>
                        <button onClick={() => navigate('/rekap')} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow">📖 Riwayat</button>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow">Keluar</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-transparent dark:border-gray-700 transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Catat Ibadah</h2>
                                <input 
                                    type="date" 
                                    value={tanggal} 
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="border-2 border-emerald-300 dark:border-emerald-600 rounded-lg px-3 py-1 font-bold text-gray-700 dark:text-white dark:bg-gray-700 bg-white"
                                />
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <label className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" name="puasa" checked={formData.puasa} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500" />
                                    <span className="font-bold text-gray-700 dark:text-gray-200">Puasa Hari Ini</span>
                                </label>

                                <div>
                                    <h3 className="font-bold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2 mb-3">Shalat Wajib</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                                            <label key={waktu} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <input type="checkbox" name={`shalat_${waktu}`} checked={formData[`shalat_${waktu}`]} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                                                <span className="capitalize text-gray-600 dark:text-gray-400">Shalat {waktu}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2 mb-3">Sunnah & Al-Quran</h3>
                                    <label className="flex items-center space-x-2 cursor-pointer mb-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg w-fit transition-colors">
                                        <input type="checkbox" name="tarawih" checked={formData.tarawih} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
                                        <span className="text-gray-600 dark:text-gray-400">Shalat Tarawih</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Surah</label>
                                            <input type="text" name="tadarus_surah" value={formData.tadarus_surah} onChange={handleChange} placeholder="Contoh: Al-Baqarah" className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors dark:bg-gray-700 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Ayat Terakhir</label>
                                            <input type="number" name="tadarus_ayat" value={formData.tadarus_ayat} onChange={handleChange} placeholder="Contoh: 15" className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors dark:bg-gray-700 dark:text-white" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:-translate-y-1">
                                    💾 Simpan Catatan Ibadah
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-blue-500 transition-colors">
                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">📈 Progres 7 Hari Terakhir</h3>
                            <div className="h-48 w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <XAxis dataKey="tanggal" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} fontSize={12} />
                                            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', color: theme === 'dark' ? '#fff' : '#000', borderRadius: '8px', border: 'none' }} />
                                            <Line type="monotone" dataKey="poin" stroke="#10b981" strokeWidth={4} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">Belum ada data progres harian.</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-emerald-400 text-center transition-colors">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Total Poin</p>
                                <p className="text-xl font-bold text-emerald-600">{stats.total_poin || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-blue-400 text-center transition-colors">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Hari Puasa</p>
                                <p className="text-xl font-bold text-blue-600">{stats.total_puasa || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-indigo-400 text-center transition-colors">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Shalat Wajib</p>
                                <p className="text-xl font-bold text-indigo-600">{stats.total_shalat_wajib || 0}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border-t-4 border-purple-400 text-center transition-colors">
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Tadarus Terakhir</p>
                                <p className="text-sm font-bold text-purple-600 truncate mt-1">
                                    {stats.tadarus_terakhir?.surah || '-'} <br/> <span className="text-xs font-normal">(Ayat {stats.tadarus_terakhir?.ayat || '-'})</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}