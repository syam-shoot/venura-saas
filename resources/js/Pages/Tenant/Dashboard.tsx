import { Head } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, Booking } from '@/types';
import { CalendarDays, Layers, Clock } from 'lucide-react';

interface Stats { total_courts: number; total_bookings: number; pending_bookings: number; recent_bookings: Booking[]; }

export default function Dashboard({ tenant, stats }: PageProps<{ tenant: Tenant; stats: Stats }>) {
    return (
        <TenantLayout tenant={tenant}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Layers className="h-5 w-5 text-emerald-500 mb-2" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Lapangan</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_courts}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <CalendarDays className="h-5 w-5 text-blue-500 mb-2" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.total_bookings}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Pending</p>
                        <p className="text-3xl font-extrabold text-yellow-600">{stats.pending_bookings}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Booking Terbaru</h3>
                    <div className="space-y-2">
                        {(stats.recent_bookings || []).length === 0 && <p className="text-sm text-slate-400">Belum ada booking.</p>}
                        {(stats.recent_bookings || []).map((b) => (
                            <div key={b.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{b.team_name}</p>
                                    <p className="text-[11px] text-slate-400">{b.court?.name} • {b.date}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : b.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{b.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
