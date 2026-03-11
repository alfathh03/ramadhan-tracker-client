import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Rekap() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchHistory(parsedUser.id);
        }
    }, [navigate]);

    const fetchHistory = async (userId) => {
        try {
            const res = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/api/tracker/rekap/${userId}`);
            // Mengambil data riwayat dari API yang sudah Anda buat di backend
            setHistory(res.data.history || []);
        } catch (error) {
            console.error("Gagal mengambil riwayat", error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk membuat tanggal lebih cantik (Contoh: Senin, 11 Maret 2026)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const renderCheck = (value) => {
        return (value === 1 || value === true) ? "✅" : "❌";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/dashboard')} className="text-emerald-600 font-bold hover:underline transition">
                        ← Kembali ke Dashboard
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Riwayat Ibadah 📖</h1>
                    <p className="text-gray-500 mt-2">Catatan perjalanan ibadah {user?.nama} di bulan Ramadhan</p>
                </div>

                {/* Timeline History */}
                {loading ? (
                    <p className="text-center text-gray-500 font-bold animate-pulse">Memuat riwayat ibadah...</p>
                ) : history.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow text-center border-t-4 border-emerald-500">
                        <p className="text-gray-500">Belum ada catatan ibadah yang tersimpan.</p>
                        <button onClick={() => navigate('/dashboard')} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">
                            Mulai Catat Ibadah
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <div key={index} className="bg-white p-5 md:p-6 rounded-2xl shadow-md border-l-8 border-emerald-500 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                    <h3 className="font-bold text-lg text-gray-800 bg-gray-100 px-4 py-1 rounded-lg">
                                        📅 {formatDate(item.tanggal)}
                                    </h3>
                                    <span className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-full text-sm">
                                        ⭐ +{item.poin_harian} Poin
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    <div className="bg-gray-50 p-3 rounded-xl border">
                                        <p className="text-sm text-gray-500 mb-1">Puasa</p>
                                        <p className="font-bold text-gray-700">{renderCheck(item.puasa)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border">
                                        <p className="text-sm text-gray-500 mb-1">Tarawih</p>
                                        <p className="font-bold text-gray-700">{renderCheck(item.tarawih)}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border col-span-2 md:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Shalat Wajib (5 Waktu)</p>
                                        <div className="flex justify-between text-sm font-bold text-gray-700 mt-1">
                                            <span>S: {renderCheck(item.shalat_subuh)}</span>
                                            <span>D: {renderCheck(item.shalat_dzuhur)}</span>
                                            <span>A: {renderCheck(item.shalat_ashar)}</span>
                                            <span>M: {renderCheck(item.shalat_maghrib)}</span>
                                            <span>I: {renderCheck(item.shalat_isya)}</span>
                                        </div>
                                    </div>
                                </div>

                                {item.tadarus_surah && (
                                    <div className="mt-4 bg-purple-50 p-3 rounded-xl border border-purple-100">
                                        <p className="text-sm text-purple-600 font-bold">📖 Tadarus Quran</p>
                                        <p className="text-gray-700">Surah <span className="font-bold">{item.tadarus_surah}</span>, Ayat <span className="font-bold">{item.tadarus_ayat}</span></p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}