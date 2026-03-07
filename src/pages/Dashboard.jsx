import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tanggalHariIni, setTanggalHariIni] = useState('');
    
    const [tracker, setTracker] = useState({
        puasa: false,
        shalat_subuh: false,
        shalat_dzuhur: false,
        shalat_ashar: false,
        shalat_maghrib: false,
        shalat_isya: false,
        tarawih: false,
        tadarus_surah: '',
        tadarus_ayat: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const today = new Date().toISOString().split('T')[0];
        setTanggalHariIni(today);

        fetchTrackerData(parsedUser.id, today);
    }, [navigate]);

    const fetchTrackerData = async (userId, tanggal) => {
        try {
            const response = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/`);
            if (response.data.data) {
                const dbData = response.data.data;
                setTracker({
                    puasa: !!dbData.puasa,
                    shalat_subuh: !!dbData.shalat_subuh,
                    shalat_dzuhur: !!dbData.shalat_dzuhur,
                    shalat_ashar: !!dbData.shalat_ashar,
                    shalat_maghrib: !!dbData.shalat_maghrib,
                    shalat_isya: !!dbData.shalat_isya,
                    tarawih: !!dbData.tarawih,
                    tadarus_surah: dbData.tadarus_surah || '',
                    tadarus_ayat: dbData.tadarus_ayat || ''
                });
            }
        } catch (error) {
            console.error('Gagal mengambil data', error);
        }
    };

    const handleCheckboxChange = (e) => {
        setTracker({ ...tracker, [e.target.name]: e.target.checked });
    };

    const handleInputChange = (e) => {
        setTracker({ ...tracker, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const payload = {
                user_id: user.id,
                tanggal: tanggalHariIni,
                ...tracker
            };
            
            const response = await axios.post('https://ramadhan-tracker-api-production.up.railway.app/', payload);
            alert('✅ ' + response.data.message);
        } catch (error) {
            alert('❌ Gagal menyimpan data');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div className="text-center mt-20 text-xl font-semibold text-gray-600">Memuat data...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                
                {/* Bagian Header */}
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Ahlan wa Sahlan, {user.nama}! ✨</h2>
                        <p className="text-emerald-100 mt-1">Tracker Ibadah Hari Ini: <span className="font-semibold">{tanggalHariIni}</span></p>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow"
                    >
                        Keluar
                    </button>
                </div>

                <div className="p-6">
                    {/* KUMPULAN TOMBOL MENU - Sudah Ditambahkan Tombol Rapor */}
                    <div className="flex justify-center gap-4 mb-8 flex-wrap">
                        <Link to="/jadwal" className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold transition-colors border border-blue-200 shadow-sm">
                            📅 Jadwal Imsakiyah
                        </Link>
                        <Link to="/doa" className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold transition-colors border border-emerald-200 shadow-sm">
                            🤲 Kumpulan Doa
                        </Link>
                        <Link to="/rekap" className="flex items-center gap-2 px-5 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-colors border border-indigo-200 shadow-sm">
                            📈 Rapor Ibadah
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Status Puasa */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Status Puasa</h3>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="puasa" checked={tracker.puasa} onChange={handleCheckboxChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer" /> 
                                <span className="text-gray-700 font-medium">Puasa Hari Ini</span>
                            </label>
                        </div>

                        {/* Shalat Wajib */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Shalat Wajib</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                                    <label key={waktu} className="flex items-center space-x-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name={`shalat_${waktu}`} 
                                            checked={tracker[`shalat_${waktu}`]} 
                                            onChange={handleCheckboxChange} 
                                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                                        /> 
                                        <span className="text-gray-700 font-medium capitalize">Shalat {waktu}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Shalat Sunnah */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Shalat Sunnah</h3>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="tarawih" checked={tracker.tarawih} onChange={handleCheckboxChange} className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer" /> 
                                <span className="text-gray-700 font-medium">Shalat Tarawih</span>
                            </label>
                        </div>

                        {/* Progres Tadarus */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Progres Tadarus</h3>
                            <div className="flex gap-3 flex-wrap">
                                <input 
                                    type="text" 
                                    name="tadarus_surah" 
                                    placeholder="Nama Surah (Misal: Al-Baqarah)" 
                                    value={tracker.tadarus_surah} 
                                    onChange={handleInputChange} 
                                    className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <input 
                                    type="number" 
                                    name="tadarus_ayat" 
                                    placeholder="Ayat ke-" 
                                    value={tracker.tadarus_ayat} 
                                    onChange={handleInputChange} 
                                    className="w-32 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave} 
                        className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        💾 Simpan Catatan Ibadah Hari Ini
                    </button>
                </div>
            </div>
        </div>
    );
}