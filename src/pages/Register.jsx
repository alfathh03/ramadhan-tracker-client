import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    // SINKRONISASI: Menggunakan nama_lengkap sesuai kolom database
    const [formData, setFormData] = useState({ nama: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Memastikan URL Back-End Railway benar
            const response = await axios.post('https://ramadhan-tracker-api-production.up.railway.app/api/auth/register', formData);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Terjadi kesalahan pada server');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Buat Akun Baru ✨</h2>
                    <p className="text-gray-500 mt-2">Mulai pantau ibadah Ramadhan Anda</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input 
                            type="text" 
                            name="nama" 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Misal: Indra"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" name="email" onChange={handleChange} required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="nama@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" name="password" onChange={handleChange} required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow mt-2">
                        Daftar Sekarang
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold">Masuk di sini</Link>
                </p>
            </div>
        </div>
    );
}