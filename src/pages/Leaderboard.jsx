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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex justify-center py-10 transition-colors duration-300">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-t-4 border-yellow-500 transition-colors">
                <button onClick={() => navigate('/dashboard')} className="text-emerald-600 dark:text-emerald-400 font-bold mb-4 hover:underline transition">
                    ← Kembali ke Dashboard
                </button>
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">🏆 Papan Peringkat</h2>
                
                <div className="space-y-3">
                    {leaders.map((user, index) => (
                        <div key={index} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${
                            index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700/50' : 
                            index === 1 ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' : 
                            index === 2 ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700/50' : 
                            'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`}>
                            <div className="flex items-center space-x-4">
                                <span className={`font-bold text-xl ${
                                    index === 0 ? 'text-yellow-500 dark:text-yellow-400' : 
                                    index === 1 ? 'text-gray-400 dark:text-gray-300' : 
                                    index === 2 ? 'text-orange-500 dark:text-orange-400' : 
                                    'text-gray-500 dark:text-gray-400'
                                }`}>
                                    #{index + 1}
                                </span>
                                <span className="font-bold text-gray-700 dark:text-gray-200 capitalize">{user.nama}</span>
                            </div>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full text-sm">
                                {user.total_poin} Poin
                            </div>
                        </div>
                    ))}
                    {leaders.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data ibadah.</p>}
                </div>
            </div>
        </div>
    );
}