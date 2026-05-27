import { Head, router } from '@inertiajs/react';
import { PageProps, Tenant } from '@/types';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { Building2, Users, CalendarDays, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Stats { total_tenants: number; active_tenants: number; total_users: number; total_bookings: number; }

export default function Dashboard({ stats, tenants }: PageProps<{ stats: Stats; tenants: Tenant[] }>) {
    const toggle = (id: number) => router.patch(`/super-admin/tenants/${id}/toggle`);

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
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Overview</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <Building2 className="h-5 w-5 text-emerald-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Venue</p>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_tenants}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <Building2 className="h-5 w-5 text-blue-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Venue Aktif</p>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.active_tenants}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <Users className="h-5 w-5 text-purple-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total User</p>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_users}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <CalendarDays className="h-5 w-5 text-orange-500 mb-2" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p>
                            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_bookings}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-white">Daftar Venue Terdaftar</h3>
                        </div>
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-900 dark:bg-slate-800">
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Venue</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Plan</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Booking</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Status</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tenants.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3">
                                            <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                                            <p className="text-[11px] text-slate-400">{t.slug} • {t.address}</p>
                                        </td>
                                        <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 uppercase">{t.plan}</span></td>
                                        <td className="p-3 text-slate-700 dark:text-slate-300">{t.bookings_count}</td>
                                        <td className="p-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${t.is_active ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                                {t.is_active ? 'AKTIF' : 'NONAKTIF'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => toggle(t.id)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition ${t.is_active ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100'}`}>
                                                {t.is_active ? 'Suspend' : 'Aktifkan'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
