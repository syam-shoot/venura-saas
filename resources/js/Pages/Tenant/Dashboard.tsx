import { Head } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, Booking } from '@/types';
import { Layers, CalendarDays, Clock, DollarSign, CalendarCheck, Star, TrendingUp, Trophy } from 'lucide-react';

interface Stats {
    total_courts: number;
    total_bookings: number;
    pending_bookings: number;
    revenue_this_month: number;
    bookings_today: number;
    avg_rating: number;
    daily_bookings: { date: string; count: number }[];
    busiest_hours: { hour: number; count: number }[];
    popular_courts: { name: string; count: number }[];
    recent_bookings: Booking[];
    recent_reviews: { id: number; rating: number; comment: string; user?: { name: string } }[];
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Icon className={`h-5 w-5 ${color} mb-2`} />
            <p className="text-[11px] font-bold text-slate-400 uppercase">{label}</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        </div>
    );
}

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
            ))}
        </div>
    );
}

export default function Dashboard({ tenant, stats }: PageProps<{ tenant: Tenant; stats: Stats }>) {
    const maxDaily = Math.max(...(stats.daily_bookings || []).map(d => d.count), 1);
    const formatCurrency = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard</h2>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <StatCard icon={Layers} label="Total Lapangan" value={stats.total_courts} color="text-emerald-500" />
                    <StatCard icon={CalendarDays} label="Total Booking" value={stats.total_bookings} color="text-blue-500" />
                    <StatCard icon={Clock} label="Pending" value={stats.pending_bookings} color="text-yellow-500" />
                    <StatCard icon={DollarSign} label="Pendapatan Bulan Ini" value={formatCurrency(stats.revenue_this_month || 0)} color="text-emerald-500" />
                    <StatCard icon={CalendarCheck} label="Booking Hari Ini" value={stats.bookings_today} color="text-indigo-500" />
                    <StatCard icon={Star} label="Rating" value={stats.avg_rating || '-'} color="text-yellow-500" />
                </div>

                {/* Daily Bookings Chart */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Booking 7 Hari Terakhir
                    </h3>
                    <div className="flex items-end gap-2 h-32">
                        {(stats.daily_bookings || []).map(d => (
                            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{d.count}</span>
                                <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }} />
                                <span className="text-[10px] text-slate-400">{d.date.slice(5)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Busiest Hours */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" /> Jam Tersibuk
                        </h3>
                        <div className="space-y-2">
                            {(stats.busiest_hours || []).map((h, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{String(h.hour).padStart(2, '0')}:00</span>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{h.count} booking</span>
                                </div>
                            ))}
                            {(stats.busiest_hours || []).length === 0 && <p className="text-sm text-slate-400">Belum ada data.</p>}
                        </div>
                    </div>

                    {/* Popular Courts */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-emerald-500" /> Lapangan Terpopuler
                        </h3>
                        <div className="space-y-2">
                            {(stats.popular_courts || []).map((c, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{c.name}</span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.count} booking</span>
                                </div>
                            ))}
                            {(stats.popular_courts || []).length === 0 && <p className="text-sm text-slate-400">Belum ada data.</p>}
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Booking Terbaru</h3>
                    <div className="space-y-2">
                        {(stats.recent_bookings || []).length === 0 && <p className="text-sm text-slate-400">Belum ada booking.</p>}
                        {(stats.recent_bookings || []).map(b => (
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

                {/* Recent Reviews */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" /> Review Terbaru
                    </h3>
                    <div className="space-y-3">
                        {(stats.recent_reviews || []).length === 0 && <p className="text-sm text-slate-400">Belum ada review.</p>}
                        {(stats.recent_reviews || []).map(r => (
                            <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{r.user?.name || 'Anonim'}</span>
                                    <Stars rating={r.rating} />
                                </div>
                                {r.comment && <p className="text-xs text-slate-500 dark:text-slate-400">{r.comment}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
