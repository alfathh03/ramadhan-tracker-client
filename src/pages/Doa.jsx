import { useNavigate } from 'react-router-dom';

export default function Doa() {
    const navigate = useNavigate();

    const daftarDoa = [
        {
            judul: "Niat Puasa Ramadhan",
            arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
            latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.",
            arti: "Aku niat berpuasa esok hari untuk menunaikan kewajiban puasa bulan Ramadhan tahun ini, karena Allah Ta'ala."
        },
        {
            judul: "Doa Berbuka Puasa (Shahih)",
            arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
            latin: "Dzahabadz dzama'u wabtallatil 'uruuqu wa tsabatal ajru, insyaa Allah.",
            arti: "Telah hilang rasa haus, telah basah urat-urat, dan telah pasti ganjaran, dengan kehendak Allah."
        },
        {
            judul: "Niat Shalat Tarawih (Sebagai Makmum)",
            arab: "اُصَلِّى سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ مَأْمُوْمًا ِللهِ تَعَالَى",
            latin: "Ushalli sunnatat taraawiihi rak'ataini mustaqbilal qiblati ma'muuman lillaahi ta'aalaa.",
            arti: "Aku niat shalat sunnah tarawih dua rakaat menghadap kiblat sebagai makmum karena Allah Ta'ala."
        },
        {
            judul: "Doa Malam Lailatul Qadar",
            arab: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
            latin: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.",
            arti: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai pemaafan, maka maafkanlah aku."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 font-sans transition-colors duration-300">
            <div className="max-w-3xl mx-auto space-y-6">
                <button onClick={() => navigate('/dashboard')} className="text-emerald-600 dark:text-emerald-400 font-bold mb-4 hover:underline transition">
                    ← Kembali ke Dashboard
                </button>
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Kumpulan Doa 🤲</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Doa-doa penting sehari-hari di bulan Ramadhan</p>
                </div>

                <div className="space-y-4">
                    {daftarDoa.map((doa, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-emerald-500 hover:shadow-lg transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{doa.judul}</h2>
                            <p className="text-right text-3xl font-arabic text-gray-900 dark:text-gray-100 mb-4 leading-loose" dir="rtl">{doa.arab}</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium italic mb-2">{doa.latin}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Artinya: "{doa.arti}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}