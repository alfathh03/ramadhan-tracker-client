import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('https://ramadhan-tracker-api-production.up.railway.app/api/tracker/leaderboard');
                setLeaders(res.data);
            } catch (error) {
                console.error("Gagal mengambil leaderboard", error);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center py-10">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 border-t-4 border-yellow-500">
                <button onClick={() => navigate('/dashboard')} className="text-emerald-600 font-bold mb-4 hover:underline">
                    ← Kembali ke Dashboard
                </button>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🏆 Papan Peringkat</h2>
                
                <div className="space-y-3">
                    {leaders.map((user, index) => (
                        <div key={index} className={`flex justify-between items-center p-4 rounded-xl border ${index === 0 ? 'bg-yellow-50 border-yellow-200' : index === 1 ? 'bg-gray-50 border-gray-200' : index === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
                            <div className="flex items-center space-x-4">
                                <span className={`font-bold text-xl ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-500' : 'text-gray-500'}`}>
                                    #{index + 1}
                                </span>
                                <span className="font-bold text-gray-700 capitalize">{user.nama}</span>
                            </div>
                            <div className="font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full text-sm">
                                {user.total_poin} Poin
                            </div>
                        </div>
                    ))}
                    {leaders.length === 0 && <p className="text-center text-gray-500">Belum ada data ibadah.</p>}
                </div>
            </div>
        </div>
    );
}