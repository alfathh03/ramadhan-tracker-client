import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Jadwal() {
    const navigate = useNavigate();
    const [jadwal, setJadwal] = useState([]);
    const [kota, setKota] = useState('Jakarta');
    const [inputKota, setInputKota] = useState('Jakarta');
    const [loading, setLoading] = useState(false);

    // Fungsi untuk memanggil API Aladhan
    const fetchJadwal = async (searchKota) => {
        setLoading(true);
        try {
            const date = new Date();
            const tahun = date.getFullYear();
            const bulan = date.getMonth() + 1; // Bulan saat ini (1-12)

            // Memanggil API Aladhan (Method 11 standar untuk Asia Tenggara)
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

    // Ambil data pertama kali saat halaman dibuka
    useEffect(() => {
        fetchJadwal('Jakarta');
    }, []);

    // Fungsi saat tombol cari ditekan
    const handleSearch = (e) => {
        e.preventDefault();
        if (inputKota.trim() !== '') {
            fetchJadwal(inputKota);
        }
    };

    // Fungsi untuk membersihkan teks waktu dari API (misal: "04:30 (+07)" menjadi "04:30")
    const cleanTime = (time) => {
        return time ? time.split(' ')[0] : '-';
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans flex justify-center">
            <div className="max-w-6xl w-full space-y-6">
                <button onClick={() => navigate('/dashboard')} className="text-emerald-600 font-bold mb-4 hover:underline transition">
                    ← Kembali ke Dashboard
                </button>
                
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Jadwal Imsakiyah & Shalat ⏰</h1>
                    <p className="text-gray-500 mt-2">Data Real-Time dari API Aladhan</p>
                </div>

                {/* Form Pencarian Kota */}
                <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-emerald-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">Kota: {kota}</h2>
                        <p className="text-sm text-gray-500">Bulan ini</p>
                    </div>
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                        <input 
                            type="text" 
                            value={inputKota} 
                            onChange={(e) => setInputKota(e.target.value)}
                            placeholder="Masukkan nama kota..." 
                            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        />
                        <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg shadow transition">
                            {loading ? 'Mencari...' : 'Cari'}
                        </button>
                    </form>
                </div>

                {/* Tabel Jadwal */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-emerald-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-max">
                            <thead>
                                <tr className="bg-emerald-50 text-emerald-800">
                                    <th className="p-4 border-b font-bold">Tanggal (Masehi)</th>
                                    <th className="p-4 border-b font-bold">Hijriyah</th>
                                    <th className="p-4 border-b font-bold text-center text-red-600">Imsak</th>
                                    <th className="p-4 border-b font-bold text-center">Subuh</th>
                                    <th className="p-4 border-b font-bold text-center">Dzuhur</th>
                                    <th className="p-4 border-b font-bold text-center">Ashar</th>
                                    <th className="p-4 border-b font-bold text-center text-emerald-600">Maghrib (Buka)</th>
                                    <th className="p-4 border-b font-bold text-center">Isya</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        {/* PERBAIKAN: colSpan diubah menjadi 8 karena sekarang ada 8 kolom */}
                                        <td colSpan="8" className="p-8 text-center text-gray-500 font-bold">Memuat jadwal...</td>
                                    </tr>
                                ) : (
                                    jadwal.map((day, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition border-b last:border-0 whitespace-nowrap">
                                            <td className="p-4 font-bold text-gray-700">{day.date.readable}</td>
                                            <td className="p-4 text-gray-600">{day.date.hijri.day} {day.date.hijri.month.en}</td>
                                            <td className="p-4 text-center font-bold text-red-500 bg-red-50/30">{cleanTime(day.timings.Imsak)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700">{cleanTime(day.timings.Fajr)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700">{cleanTime(day.timings.Dhuhr)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700">{cleanTime(day.timings.Asr)}</td>
                                            <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/50">{cleanTime(day.timings.Maghrib)}</td>
                                            <td className="p-4 text-center font-bold text-gray-700">{cleanTime(day.timings.Isha)}</td>
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