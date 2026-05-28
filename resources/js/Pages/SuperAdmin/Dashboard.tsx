import { Head, router, useForm } from '@inertiajs/react';
import { PageProps, Tenant } from '@/types';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { Building2, Users, CalendarDays, LogOut, ShieldCheck, Clock, Plus, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from '@/Components/Toast';
import { useState } from 'react';

interface Stats { total_tenants: number; active_tenants: number; pending_tenants: number; total_users: number; unverified_users: number; total_bookings: number; total_courts: number; }

export default function Dashboard({ stats, tenants, courtsByType }: PageProps<{ stats: Stats; tenants: (Tenant & { is_verified: boolean })[]; courtsByType: { type: string; total: number }[] }>) {
    const [showAddMitra, setShowAddMitra] = useState(false);
    const toggle = (slug: string) => router.patch(`/super-admin/tenants/${slug}/toggle`);
    const verify = (slug: string) => router.patch(`/super-admin/tenants/${slug}/verify`, {}, { onSuccess: () => toast('Venue berhasil diverifikasi!') });

    const { data, setData, post, processing, reset, errors } = useForm({ name: '', email: '', phone: '', password: '', venue_name: '', city: '', address: '' });
    const submitMitra = (e: React.FormEvent) => { e.preventDefault(); post('/super-admin/mitra', { onSuccess: () => { reset(); setShowAddMitra(false); toast('Mitra berhasil ditambahkan!'); } }); };

    return (
        <>
            <Head title="Super Admin" />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <VenuraLogo className="h-8 w-8" />
                        <div>
                            <span className="font-extrabold text-slate-900 dark:text-white">Venura</span>
                            <span className="text-[10px] text-slate-400 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">SUPER ADMIN</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <DarkModeToggle />
                        <Link href={route('logout')} method="post" as="button" className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"><LogOut className="h-5 w-5" /></Link>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Overview</h2>
                        <div className="flex items-center gap-2">
                            <Link href="/super-admin/users" className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-md transition">
                                <Users className="h-4 w-4" /> Kelola User
                            </Link>
                            <button onClick={() => setShowAddMitra(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition">
                                <Plus className="h-4 w-4" /> Tambah Mitra
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <Building2 className="h-4 w-4 text-emerald-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Venue</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_tenants}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <ShieldCheck className="h-4 w-4 text-blue-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Terverifikasi</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.active_tenants}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <Clock className="h-4 w-4 text-yellow-500 mb-2" />
                            <p className="text-[11px] font-bold text-yellow-600 uppercase">Menunggu Verifikasi</p>
                            <p className="text-2xl font-extrabold text-yellow-600">{stats.pending_tenants}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <Users className="h-4 w-4 text-purple-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total User</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_users}</p>
                        </div>
                        {stats.unverified_users > 0 && (
                            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-orange-200 dark:border-orange-800">
                                <Users className="h-4 w-4 text-orange-500 mb-2" />
                                <p className="text-[11px] font-bold text-orange-500 uppercase">Belum Verifikasi Email</p>
                                <p className="text-2xl font-extrabold text-orange-500">{stats.unverified_users}</p>
                            </div>
                        )}
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <CalendarDays className="h-4 w-4 text-orange-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_bookings}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <Building2 className="h-4 w-4 text-cyan-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Lapangan</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.total_courts}</p>
                        </div>
                    </div>

                    {/* Courts by Type */}
                    {courtsByType.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Lapangan per Kategori</h3>
                            <div className="flex flex-wrap gap-3">
                                {courtsByType.map((c) => (
                                    <div key={c.type} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.type}</span>
                                        <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-md">{c.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Venue Revenue This Month - moved to detail page */}

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white">Daftar Venue</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-900 dark:bg-slate-800">
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Venue</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Kota</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Booking</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Status</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tenants.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3">
                                            <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                                            <p className="text-[11px] text-slate-400">{t.slug} • {t.email}</p>
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{(t as any).city || '-'}</td>
                                        <td className="p-3 text-slate-700 dark:text-slate-300">{t.bookings_count}</td>
                                        <td className="p-3">
                                            <div className="flex flex-col gap-1">
                                                {t.is_verified ? (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 w-fit">VERIFIED</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 w-fit">PENDING</span>
                                                )}
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${t.is_active ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                                    {t.is_active ? 'AKTIF' : 'NONAKTIF'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-end gap-1.5 min-w-[200px]">
                                                <Link href={`/super-admin/tenants/${t.slug}`} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition">Detail</Link>
                                                {!t.is_verified && (
                                                    <button onClick={() => verify(t.slug)} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition">Verifikasi</button>
                                                )}
                                                <button onClick={() => toggle(t.slug)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition ${t.is_active ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100'}`}>
                                                    {t.is_active ? 'Suspend' : 'Aktifkan'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Mitra Modal */}
                {showAddMitra && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Tambah Mitra Venue</h3>
                                <button onClick={() => setShowAddMitra(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="h-5 w-5 text-slate-400" /></button>
                            </div>
                            <form onSubmit={submitMitra} className="p-5 space-y-3">
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Nama Pemilik</Label><Input value={data.name} onChange={e=>setData('name',e.target.value)} className="mt-1" placeholder="Nama lengkap" required/>{errors.name&&<p className="text-red-400 text-xs mt-1">{errors.name}</p>}</div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Email</Label><Input type="email" value={data.email} onChange={e=>setData('email',e.target.value)} className="mt-1" placeholder="email@domain.com" required/>{errors.email&&<p className="text-red-400 text-xs mt-1">{errors.email}</p>}</div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Telepon</Label><Input value={data.phone} onChange={e=>setData('phone',e.target.value)} className="mt-1" placeholder="08xxx" required/></div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Kata Sandi</Label><Input type="password" value={data.password} onChange={e=>setData('password',e.target.value)} className="mt-1" placeholder="Min. 8 karakter" required/>{errors.password&&<p className="text-red-400 text-xs mt-1">{errors.password}</p>}</div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Nama Venue</Label><Input value={data.venue_name} onChange={e=>setData('venue_name',e.target.value)} className="mt-1" placeholder="Green Futsal Arena" required/></div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Kota</Label><Input value={data.city} onChange={e=>setData('city',e.target.value)} className="mt-1" placeholder="Makassar" required/></div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Alamat</Label><Input value={data.address} onChange={e=>setData('address',e.target.value)} className="mt-1" placeholder="Jl. ..." required/></div>
                                
                                <button type="submit" disabled={processing} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition text-sm">
                                    {processing ? 'Membuat...' : 'Tambah Mitra'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
