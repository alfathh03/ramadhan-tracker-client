import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Untuk membuat link pindah halaman

export default function Jadwal() {
    const [jadwal, setJadwal] = useState(null);
    const [kota, setKota] = useState('Jakarta'); // Default kota awal
    const [loading, setLoading] = useState(false);

    // Fungsi untuk mengambil data dari server Aladhan
    const fetchJadwal = async (kotaPilihan) => {
        setLoading(true);
        try {
            // Memanggil API Publik (method=20 adalah standar Kemenag RI)
            const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${kotaPilihan}&country=Indonesia&method=20`);
            setJadwal(response.data.data.timings); // Menyimpan hasil jadwal ke state
        } catch (error) {
            alert('Gagal mengambil jadwal shalat. Pastikan internet menyala.');
        } finally {
            setLoading(false);
        }
    };

    // useEffect ini akan otomatis berjalan setiap kali tulisan "kota" berubah
    useEffect(() => {
        fetchJadwal(kota);
    }, [kota]);

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>Jadwal Imsakiyah & Shalat</h2>
            
            {/* Tombol kembali ke Dashboard */}
            <Link to="/dashboard" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: 'blue' }}>
                ⬅ Kembali ke Tracker Ibadah
            </Link>

            <br />

            {/* Dropdown untuk memilih kota */}
            <select 
                value={kota} 
                onChange={(e) => setKota(e.target.value)} 
                style={{ padding: '8px', fontSize: '16px', width: '100%', marginBottom: '20px' }}
            >
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Semarang">Semarang</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Medan">Medan</option>
                <option value="Makassar">Makassar</option>
                <option value="Balikpapan">Balikpapan</option>
            </select>

            {/* Menampilkan status loading atau jadwalnya */}
            {loading ? (
                <p>Memuat jadwal dari satelit... 📡</p>
            ) : jadwal ? (
                <div style={{ textAlign: 'left', background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}><strong>Imsak:</strong> <span style={{ float: 'right' }}>{jadwal.Imsak}</span></p>
                    <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}><strong>Subuh:</strong> <span style={{ float: 'right' }}>{jadwal.Fajr}</span></p>
                    <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}><strong>Dzuhur:</strong> <span style={{ float: 'right' }}>{jadwal.Dhuhr}</span></p>
                    <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}><strong>Ashar:</strong> <span style={{ float: 'right' }}>{jadwal.Asr}</span></p>
                    <p style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', color: 'green' }}><strong>Maghrib (Buka):</strong> <span style={{ float: 'right' }}>{jadwal.Maghrib}</span></p>
                    <p><strong>Isya:</strong> <span style={{ float: 'right' }}>{jadwal.Isha}</span></p>
                </div>
            ) : null}
        </div>
    );
}