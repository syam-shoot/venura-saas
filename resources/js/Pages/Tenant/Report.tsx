import { Head, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant } from '@/types';
import { useState } from 'react';

interface ReportRow { date: string; count: number; revenue: number; }
interface Props { tenant: Tenant; report: ReportRow[]; from: string; to: string; totalRevenue: number; totalBookings: number; }

export default function Report({ tenant, report, from, to, totalRevenue, totalBookings }: PageProps<Props>) {
    const [dateFrom, setDateFrom] = useState(from);
    const [dateTo, setDateTo] = useState(to);

    const filter = () => router.get(`/${tenant.slug}/admin/report`, { from: dateFrom, to: dateTo }, { preserveState: true });

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Laporan Pendapatan" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Laporan Pendapatan</h2>
                <div className="flex flex-wrap gap-3 items-end">
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Dari</label><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"/></div>
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sampai</label><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"/></div>
                    <button onClick={filter} className="px-5 py-2 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition">Filter</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Total Pendapatan</p>
                        <p className="text-3xl font-extrabold text-emerald-600">Rp {Number(totalRevenue).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalBookings}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-100 dark:border-slate-800 text-left"><th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase">Tanggal</th><th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase">Booking</th><th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase">Pendapatan</th></tr></thead>
                        <tbody>
                            {report.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-400">Tidak ada data</td></tr>}
                            {report.map(r => (
                                <tr key={r.date} className="border-b border-slate-50 dark:border-slate-800">
                                    <td className="px-5 py-3 text-slate-900 dark:text-white">{r.date}</td>
                                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{r.count}</td>
                                    <td className="px-5 py-3 font-semibold text-emerald-600">Rp {Number(r.revenue).toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </TenantLayout>
    );
}
