import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Rekap() {
    const navigate = useNavigate();
    const [rekap, setRekap] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        fetchData(parsedUser.id);
    }, [navigate]);

    const fetchData = async (userId) => {
        try {
            // Ambil Data Rekap & Grafik
            const resRekap = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/api/tracker/rekap/${userId}`);
            setRekap(resRekap.data);
            
            // Format data untuk grafik (mengambil dari data historis di backend)
            // Di sini kita asumsikan backend mengirimkan array 'history' juga
            const formattedChart = resRekap.data.history?.map(item => ({
                tgl: item.tanggal.split('-')[2], // Ambil tanggalnya saja
                poin: item.poin_harian
            })).reverse() || [];
            setChartData(formattedChart);

            // Ambil Data Leaderboard
            const resLeader = await axios.get(`https://ramadhan-tracker-api-production.up.railway.app/api/tracker/leaderboard`);
            setLeaderboard(resLeader.data);
        } catch (error) {
            console.error("Gagal memuat data pro", error);
        }
    };

    if (!rekap || !user) return <div className="text-center mt-20">Memproses Rapor Pro... 🚀</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header Statistik */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center border-b-4 border-indigo-500">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Rapor Ibadah Pro 🏆</h2>
                        <p className="text-gray-500">Total Poin Anda: <span className="font-bold text-indigo-600">{rekap.total_poin || 0} XP</span></p>
                    </div>
                    <Link to="/dashboard" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition">⬅ Kembali</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Statistik & Grafik */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Card Grafik */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4">Tren Poin Ibadah (7 Hari Terakhir)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="tgl" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="poin" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Card Detail Ibadah */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-emerald-600 text-sm font-medium">Puasa</p>
                                <p className="text-2xl font-bold text-emerald-700">{rekap.total_puasa} Hari</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-blue-600 text-sm font-medium">Tarawih</p>
                                <p className="text-2xl font-bold text-blue-700">{rekap.total_tarawih} Kali</p>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Leaderboard */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            ⭐ Peringkat Global
                        </h3>
                        <div className="space-y-4">
                            {leaderboard.map((player, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${player.nama === user.nama ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-gray-700">{player.nama}</span>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600">{player.total_poin} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}