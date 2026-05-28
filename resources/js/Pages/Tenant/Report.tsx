import { Head, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant } from '@/types';
import { useState } from 'react';
import { Wallet, CalendarDays } from 'lucide-react';

interface ReportRow { date: string; count: number; revenue: number; }
interface Props { tenant: Tenant; report: ReportRow[]; from: string; to: string; totalRevenue: number; totalBookings: number; }

export default function Report({ tenant, report, from, to, totalRevenue, totalBookings }: PageProps<Props>) {
    const [dateFrom, setDateFrom] = useState(from);
    const [dateTo, setDateTo] = useState(to);
    const maxRevenue = Math.max(...report.map(r => Number(r.revenue)), 1);

    const filter = () => router.get(`/${tenant.slug}/admin/report`, { from: dateFrom, to: dateTo }, { preserveState: true });

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Laporan Pendapatan" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Laporan Pendapatan</h2>

                {/* Filter */}
                <div className="flex flex-wrap gap-3 items-end">
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Dari</label><input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"/></div>
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sampai</label><input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"/></div>
                    <button onClick={filter} className="px-5 py-2 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition">Filter</button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Pendapatan</p>
                            <p className="text-2xl font-extrabold text-emerald-600 mt-1">Rp {Number(totalRevenue).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 p-3 rounded-xl"><Wallet className="h-6 w-6" /></div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p>
                            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalBookings}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 p-3 rounded-xl"><CalendarDays className="h-6 w-6" /></div>
                    </div>
                </div>

                {/* Revenue Chart */}
                {report.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Grafik Pendapatan</h3>
                        <p className="text-[11px] text-slate-400 mb-4">Pendapatan harian dalam periode yang dipilih</p>
                        <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
                            {report.map((r) => (
                                <div key={r.date} className="flex flex-col items-center gap-1 min-w-[40px] flex-1">
                                    <span className="text-[9px] text-slate-400 font-medium">Rp{(Number(r.revenue)/1000).toFixed(0)}k</span>
                                    <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ height: '140px' }}>
                                        <div
                                            className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all"
                                            style={{ height: `${Math.max((Number(r.revenue) / maxRevenue) * 100, 4)}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-medium">{r.date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white">Detail Harian</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead><tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                            <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase text-left">Tanggal</th>
                            <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase text-left">Booking</th>
                            <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase text-left">Pendapatan</th>
                        </tr></thead>
                        <tbody>
                            {report.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-400">Tidak ada data untuk periode ini</td></tr>}
                            {report.map(r => (
                                <tr key={r.date} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{r.date}</td>
                                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{r.count} booking</td>
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
