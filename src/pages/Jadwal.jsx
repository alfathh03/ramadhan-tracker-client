import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Jadwal() {
    const navigate = useNavigate();
    const [jadwal, setJadwal] = useState([]);
    const [kota, setKota] = useState('Jakarta');
    const [inputKota, setInputKota] = useState('Jakarta');
    const [loading, setLoading] = useState(false);

    const fetchJadwal = async (searchKota) => {
        setLoading(true);
        try {
            const date = new Date();
            const tahun = date.getFullYear();
            const bulan = date.getMonth() + 1;
            const res = await axios.get(`https://api.aladhan.com/v1/calendarByCity/${tahun}/${bulan}?city=${searchKota}&country=Indonesia&method=11`);
            setJadwal(res.data.data);
            setKota(searchKota);
        } catch (error) {
            console.error("Gagal mengambil jadwal", error);
            alert("Gagal mengambil jadwal. Pastikan nama kota benar.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJadwal('Jakarta');
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (inputKota.trim() !== '') fetchJadwal(inputKota);
    };

    const cleanTime = (time) => time ? time.split(' ')[0] : '-';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 font-sans flex justify-center transition-colors duration-300">
            <div className="max-w-6xl w-full space-y-6">
                <button onClick={() => navigate('/dashboard')} className="text-emerald-600 dark:text-emerald-400 font-bold mb-4 hover:underline transition">
                    ← Kembali ke Dashboard
                </button>
                
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Jadwal Imsakiyah & Shalat ⏰</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Data Real-Time dari API Aladhan</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-emerald-500 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">Kota: {kota}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bulan ini</p>
                    </div>
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                        <input 
                            type="text" 
                            value={inputKota} 
                            onChange={(e) => setInputKota(e.target.value)}
                            placeholder="Masukkan nama kota..." 
                            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition bg-white dark:bg-gray-700 dark:text-white"
                        />
                        <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg shadow transition">
                            {loading ? 'Mencari...' : 'Cari'}
                        </button>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-t-4 border-emerald-500 transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-b dark:border-gray-700">
                                    <th className="p-4 font-bold">Tanggal</th>
                                    <th className="p-4 font-bold">Hijriyah</th>
                                    <th className="p-4 font-bold text-center text-red-600 dark:text-red-400">Imsak</th>
                                    <th className="p-4 font-bold text-center">Subuh</th>
                                    <th className="p-4 font-bold text-center">Dzuhur</th>
                                    <th className="p-4 font-bold text-center">Ashar</th>
                                    <th className="p-4 font-bold text-center text-emerald-600 dark:text-emerald-400">Maghrib</th>
                                    <th className="p-4 font-bold text-center">Isya</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400 font-bold">Memuat jadwal...</td>
                                    </tr>
                                ) : (
                                    jadwal.map((day, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b dark:border-gray-700 last:border-0 whitespace-nowrap">
                                            <td className="p-4 font-bold text-gray-700 dark:text-gray-200">{day.date.readable}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-400">{day.date.hijri.day} {day.date.hijri.month.en}</td>
                                            <td className="p-4 text-center font-bold text-red-500 dark:text-red-400 bg-red-50/30 dark:bg-red-900/10">{cleanTime(day.timings.Imsak)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{cleanTime(day.timings.Fajr)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{cleanTime(day.timings.Dhuhr)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{cleanTime(day.timings.Asr)}</td>
                                            <td className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10">{cleanTime(day.timings.Maghrib)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">{cleanTime(day.timings.Isha)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}