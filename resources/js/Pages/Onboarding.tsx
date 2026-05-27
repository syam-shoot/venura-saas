import { Head, useForm } from '@inertiajs/react';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { useState } from 'react';

const provinces: Record<string, string[]> = {
    'Aceh': ['Banda Aceh', 'Lhokseumawe', 'Langsa', 'Sabang'],
    'Sumatera Utara': ['Medan', 'Binjai', 'Pematang Siantar', 'Tebing Tinggi'],
    'Sumatera Barat': ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok'],
    'Riau': ['Pekanbaru', 'Dumai'],
    'Kepulauan Riau': ['Batam', 'Tanjung Pinang'],
    'Jambi': ['Jambi', 'Sungai Penuh'],
    'Sumatera Selatan': ['Palembang', 'Prabumulih', 'Lubuklinggau'],
    'Bengkulu': ['Bengkulu'],
    'Lampung': ['Bandar Lampung', 'Metro'],
    'Bangka Belitung': ['Pangkal Pinang'],
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'],
    'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cimahi', 'Tasikmalaya', 'Cirebon', 'Sukabumi'],
    'Banten': ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon'],
    'Jawa Tengah': ['Semarang', 'Solo', 'Salatiga', 'Magelang', 'Pekalongan', 'Tegal'],
    'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Kediri', 'Madiun', 'Mojokerto', 'Pasuruan', 'Blitar'],
    'Bali': ['Denpasar', 'Badung', 'Gianyar'],
    'NTB': ['Mataram', 'Bima'],
    'NTT': ['Kupang'],
    'Kalimantan Barat': ['Pontianak', 'Singkawang'],
    'Kalimantan Tengah': ['Palangkaraya'],
    'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru'],
    'Kalimantan Timur': ['Samarinda', 'Balikpapan', 'Bontang'],
    'Kalimantan Utara': ['Tarakan'],
    'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon'],
    'Sulawesi Tengah': ['Palu'],
    'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo'],
    'Sulawesi Tenggara': ['Kendari'],
    'Gorontalo': ['Gorontalo'],
    'Sulawesi Barat': ['Mamuju'],
    'Maluku': ['Ambon'],
    'Maluku Utara': ['Ternate'],
    'Papua': ['Jayapura'],
    'Papua Barat': ['Manokwari', 'Sorong'],
};

export default function Onboarding() {
    const [province, setProvince] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        city: '',
        phone: '',
    });

    const cities = province ? provinces[province] || [] : [];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding');
    };

    return (
        <>
            <Head title="Setup Venue" />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-6"><VenuraLogo className="h-12 w-12" /></div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <h1 className="text-xl font-extrabold text-white mb-1 text-center">Setup Venue Kamu</h1>
                        <p className="text-sm text-slate-400 text-center mb-6">Lengkapi data venue untuk mulai menerima booking</p>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Nama Venue</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" placeholder="Contoh: Green Futsal Arena" required />
                                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Provinsi</label>
                                <select value={province} onChange={(e) => { setProvince(e.target.value); setData('city', ''); }} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" required>
                                    <option value="">Pilih Provinsi</option>
                                    {Object.keys(provinces).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Kota</label>
                                <select value={data.city} onChange={(e) => setData('city', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" required disabled={!province}>
                                    <option value="">{province ? 'Pilih Kota' : 'Pilih provinsi dulu'}</option>
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Alamat Lengkap</label>
                                <input type="text" value={data.address} onChange={(e) => setData('address', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" placeholder="Jl. Sudirman No. 10, Kel. ..." required />
                                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Nomor Telepon Venue</label>
                                <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" placeholder="08xxxxxxxxxx" required />
                                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <button type="submit" disabled={processing} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm">
                                {processing ? 'Membuat...' : 'Buat Venue & Mulai'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
