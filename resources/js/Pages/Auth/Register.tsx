import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { VenuraLogo } from '@/Components/VenuraLogo';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        register_as: 'customer' as 'customer' | 'venue_owner',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex bg-slate-950">
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden items-center justify-center p-12">
                    <div className="relative z-10 text-white max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <VenuraLogo className="h-12 w-12" />
                            <span className="font-extrabold text-3xl">Venura</span>
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight mb-4">Bergabung &<br />Mulai Booking</h2>
                        <p className="text-emerald-100 text-lg">Daftar gratis dan nikmati kemudahan booking lapangan olahraga kapan saja.</p>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <VenuraLogo />
                            <span className="font-extrabold text-xl text-white">Venura</span>
                        </div>

                        <h1 className="text-2xl font-extrabold text-white mb-1">Buat Akun Baru</h1>
                        <p className="text-slate-400 text-sm mb-6">Pilih jenis akun dan isi data kamu</p>

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button type="button" onClick={() => setData('register_as', 'customer')}
                                className={`p-3 rounded-xl border text-center transition ${data.register_as === 'customer' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                                <svg className={`w-7 h-7 mx-auto mb-1 ${data.register_as === 'customer' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <p className={`text-[12px] font-bold ${data.register_as === 'customer' ? 'text-emerald-400' : 'text-slate-400'}`}>Pemain</p>
                                <p className="text-[10px] text-slate-500">Saya ingin booking lapangan</p>
                            </button>
                            <button type="button" onClick={() => setData('register_as', 'venue_owner')}
                                className={`p-3 rounded-xl border text-center transition ${data.register_as === 'venue_owner' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600'}`}>
                                <svg className={`w-7 h-7 mx-auto mb-1 ${data.register_as === 'venue_owner' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <p className={`text-[12px] font-bold ${data.register_as === 'venue_owner' ? 'text-emerald-400' : 'text-slate-400'}`}>Mitra Venue</p>
                                <p className="text-[10px] text-slate-500">Saya ingin mendaftarkan venue</p>
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Nama Lengkap</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" placeholder="Nama lengkap" required autoFocus />
                                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" placeholder="nama@email.com" required />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Nomor Telepon</label>
                                <input type="tel" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" placeholder="08xxxxxxxxxx" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Password</label>
                                <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" placeholder="Min. 8 karakter" required />
                                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Konfirmasi Password</label>
                                <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm" placeholder="Ulangi password" required />
                            </div>
                            <button type="submit" disabled={processing} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm">
                                {processing ? 'Memproses...' : 'Daftar Sekarang'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Sudah punya akun?{' '}
                            <Link href={route('login')} className="text-emerald-400 font-semibold hover:underline">Masuk</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
