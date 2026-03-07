import { Link } from 'react-router-dom';

export default function Doa() {
    // Ini adalah Array (Daftar) yang berisi data doa-doa
    const daftarDoa = [
        {
            id: 1,
            judul: "Niat Puasa Ramadhan",
            arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
            latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aalaa.",
            arti: "Aku berniat puasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini, karena Allah Ta'ala."
        },
        {
            id: 2,
            judul: "Doa Berbuka Puasa",
            arab: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
            latin: "Allahumma laka shumtu wa bika aamantu wa 'alaa rizqika afthartu.",
            arti: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka."
        },
        {
            id: 3,
            judul: "Niat Shalat Tarawih (Sebagai Makmum)",
            arab: "أُصَلِّي سُنَّةَ التَّرَاوِيحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ مَأْمُومًا لِلَّهِ تَعَالَى",
            latin: "Ushalli sunnatat taraawiihi rak'ataini mustaqbilal qiblati ma'muuman lillaahi ta'aalaa.",
            arti: "Aku niat shalat sunnah tarawih dua rakaat menghadap kiblat sebagai makmum karena Allah Ta'ala."
        }
    ];

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h2>Kumpulan Doa Ramadhan 🤲</h2>
            
            <Link to="/dashboard" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007bff' }}>
                ⬅ Kembali ke Tracker Ibadah
            </Link>

            {/* Di sinilah keajaiban .map() terjadi! */}
            {/* React akan mengulang pembuatan kotak (div) ini sebanyak jumlah doa yang ada di atas */}
            <div>
                {daftarDoa.map((doa) => (
                    <div key={doa.id} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px', textAlign: 'left', border: '1px solid #ddd' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>{doa.judul}</h3>
                        <p style={{ fontSize: '24px', textAlign: 'right', margin: '10px 0' }}><strong>{doa.arab}</strong></p>
                        <p style={{ fontStyle: 'italic', color: '#555' }}>{doa.latin}</p>
                        <p style={{ margin: '0' }}><strong>Artinya:</strong> {doa.arti}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}