import { Head, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant } from '@/types';
import { useState } from 'react';
import { Wallet, CalendarDays, TrendingUp, Clock } from 'lucide-react';

interface ReportRow { date: string; count: number; revenue: number; }
interface MonthlyRow { month: string; count: number; revenue: number; }
interface Props { tenant: Tenant; report: ReportRow[]; monthly: MonthlyRow[]; from: string; to: string; totalRevenue: number; totalBookings: number; todayRevenue: number; todayBookings: number; }

export default function Report({ tenant, report, monthly, from, to, totalRevenue, totalBookings, todayRevenue, todayBookings }: PageProps<Props>) {
    const [dateFrom, setDateFrom] = useState(from);
    const [dateTo, setDateTo] = useState(to);
    const maxDailyRev = Math.max(...report.map(r => Number(r.revenue)), 1);
    const maxMonthlyRev = Math.max(...monthly.map(r => Number(r.revenue)), 1);

    const filter = () => router.get(`/${tenant.slug}/admin/report`, { from: dateFrom, to: dateTo }, { preserveState: true });

    const monthName = (m: string) => { const [y, mo] = m.split('-'); const names = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']; return names[parseInt(mo)-1] + ' ' + y.slice(2); };

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Clock className="h-4 w-4 text-blue-500 mb-1" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hari Ini</p>
                        <p className="text-lg font-extrabold text-slate-900 dark:text-white">Rp {Number(todayRevenue).toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400">{todayBookings} booking</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Wallet className="h-4 w-4 text-emerald-500 mb-1" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Periode Ini</p>
                        <p className="text-lg font-extrabold text-emerald-600">Rp {Number(totalRevenue).toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400">{totalBookings} booking</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <CalendarDays className="h-4 w-4 text-purple-500 mb-1" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Rata-rata/Hari</p>
                        <p className="text-lg font-extrabold text-slate-900 dark:text-white">Rp {report.length ? Number(Math.round(totalRevenue / report.length)).toLocaleString('id-ID') : '0'}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <TrendingUp className="h-4 w-4 text-orange-500 mb-1" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hari Terbaik</p>
                        <p className="text-lg font-extrabold text-slate-900 dark:text-white">Rp {Number(Math.max(...report.map(r => Number(r.revenue)), 0)).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Monthly Chart */}
                {monthly.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Pendapatan Bulanan</h3>
                        <p className="text-[11px] text-slate-400 mb-4">6 bulan terakhir</p>
                        <div className="flex items-end gap-3 h-40">
                            {monthly.map((m) => (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[9px] text-slate-400 font-medium">Rp{(Number(m.revenue)/1000000).toFixed(1)}jt</span>
                                    <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ height: '110px' }}>
                                        <div className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${Math.max((Number(m.revenue) / maxMonthlyRev) * 100, 4)}%` }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-medium">{monthName(m.month)}</span>
                                    <span className="text-[9px] text-slate-400">{m.count} bkng</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Daily Chart */}
                {report.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Pendapatan Harian</h3>
                        <p className="text-[11px] text-slate-400 mb-4">Berdasarkan filter tanggal</p>
                        <div className="flex items-end gap-1 h-36 overflow-x-auto pb-2">
                            {report.map((r) => (
                                <div key={r.date} className="flex flex-col items-center gap-1 min-w-[32px] flex-1">
                                    <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-800" style={{ height: '100px' }}>
                                        <div className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400" style={{ height: `${Math.max((Number(r.revenue) / maxDailyRev) * 100, 4)}%` }} />
                                    </div>
                                    <span className="text-[8px] text-slate-400">{r.date.slice(8)}</span>
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
                            {report.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-400">Tidak ada data</td></tr>}
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
