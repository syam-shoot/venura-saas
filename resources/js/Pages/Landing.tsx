import { Head, Link } from '@inertiajs/react';
import { VenuraLogo } from '@/Components/VenuraLogo';

export default function Landing() {
    return (
        <>
            <Head title="Venura - Platform Booking Lapangan Olahraga" />
            <div className="min-h-screen bg-slate-950 text-white">
                {/* Nav */}
                <nav className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                    <VenuraLogo />
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Login</Link>
                        <Link href="/register" className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition">Daftar Gratis</Link>
                    </div>
                </nav>

                {/* Hero */}
                <section className="max-w-6xl mx-auto px-6 py-24 text-center">
                    <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold mb-6">
                        🚀 Platform SaaS Booking Lapangan #1 di Indonesia
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Kelola Booking<br />Lapangan Olahraga<br />
                        <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Dalam 5 Menit</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
                        Daftarkan venue kamu, tambah lapangan, set tarif — pelanggan langsung bisa booking online. Tanpa coding, tanpa ribet.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition">
                            Mulai Gratis →
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: '🏟️', title: 'Multi-Venue', desc: 'Kelola banyak lapangan dalam satu dashboard. Futsal, badminton, basket, padel, dan lainnya.' },
                            { icon: '💰', title: 'Tarif Dinamis', desc: 'Set harga berbeda untuk weekday/weekend, jam sibuk/sepi. Otomatis tampil ke pelanggan.' },
                            { icon: '📺', title: 'FIDS Monitor', desc: 'Tampilan jadwal real-time gaya bandara. Pasang di TV lobby venue kamu.' },
                        ].map((f) => (
                            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                <span className="text-3xl">{f.icon}</span>
                                <h3 className="font-bold text-lg mt-3 mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-extrabold text-center mb-12">Harga Transparan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { plan: 'Free', price: '0', desc: '1 lapangan, 50 booking/bulan', features: ['Dashboard admin', 'FIDS Monitor', 'Tarif per jam'] },
                            { plan: 'Starter', price: '99.000', desc: '5 lapangan, unlimited booking', features: ['Semua fitur Free', 'Multi staff', 'Laporan bulanan'], popular: true },
                            { plan: 'Pro', price: '299.000', desc: 'Unlimited lapangan', features: ['Semua fitur Starter', 'Custom branding', 'Priority support'] },
                        ].map((p) => (
                            <div key={p.plan} className={`rounded-2xl p-6 border ${p.popular ? 'bg-emerald-500/5 border-emerald-500' : 'bg-slate-900 border-slate-800'}`}>
                                {p.popular && <span className="text-[10px] font-bold text-emerald-400 uppercase">Most Popular</span>}
                                <h3 className="text-xl font-bold mt-1">{p.plan}</h3>
                                <p className="text-3xl font-extrabold mt-2">Rp {p.price}<span className="text-sm text-slate-400 font-normal">/bulan</span></p>
                                <p className="text-sm text-slate-400 mt-1 mb-4">{p.desc}</p>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    {p.features.map((f) => <li key={f}>✓ {f}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
                    © 2026 Venura — Venue & Arena Booking Platform
                </footer>
            </div>
        </>
    );
}
