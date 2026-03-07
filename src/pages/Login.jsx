import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    // State hanya butuh email dan password untuk login
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // URL API menuju Railway
            const response = await axios.post('https://ramadhan-tracker-api-production.up.railway.app/api/auth/login', formData);
            
            // Simpan data user (id & nama_lengkap) ke localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            alert(response.data.message || 'Login Berhasil! 🚀');
            
            // Arahkan ke halaman Dashboard setelah sukses
            navigate('/dashboard'); 
        } catch (error) {
            // Menampilkan pesan error spesifik dari Back-End
            alert(error.response?.data?.message || 'Email atau Password salah!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Selamat Datang 👋</h2>
                    <p className="text-gray-500 mt-2">Masuk untuk melanjutkan Tracker Ramadhan</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            onChange={handleChange} 
                            value={formData.email}
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                            placeholder="nama@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            onChange={handleChange} 
                            value={formData.password}
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold py-3 px-4 rounded-lg shadow transition-colors`}
                    >
                        {loading ? 'Sedang Masuk...' : 'Masuk'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}