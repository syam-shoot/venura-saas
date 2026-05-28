import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Tenant, User } from '@/types';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { ArrowLeft, ShieldCheck, MapPin, Phone, Mail, Building2, Image } from 'lucide-react';
import { toast } from '@/Components/Toast';

interface Props { tenant: Tenant & { description?: string; rules?: string; facilities?: string; photos?: string[]; refund_policy?: string; city?: string; is_verified: boolean }; owner: User | null; stats: { courts: number; bookings: number }; monthlyRevenue: { month: string; count: number; revenue: number }[]; }

export default function TenantDetail({ tenant, owner, stats, monthlyRevenue }: PageProps<Props>) {
    const verify = () => router.patch(`/super-admin/tenants/${tenant.id}/verify`, {}, { onSuccess: () => toast('Venue berhasil diverifikasi!') });

    return (
        <>
            <Head title={`Detail - ${tenant.name}`} />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
                    <Link href="/super-admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><ArrowLeft className="h-5 w-5 text-slate-500" /></Link>
                    <VenuraLogo className="h-8 w-8" />
                    <span className="font-extrabold text-slate-900 dark:text-white">Detail Venue</span>
                </header>

                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{tenant.name}</h1>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {tenant.city} • {tenant.address}</span>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                    {tenant.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {tenant.phone}</span>}
                                    {tenant.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {tenant.email}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {tenant.is_verified ? (
                                    <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600"><ShieldCheck className="h-3.5 w-3.5" /> VERIFIED</span>
                                ) : (
                                    <button onClick={verify} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"><ShieldCheck className="h-3.5 w-3.5" /> Verifikasi Sekarang</button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div><p className="text-[11px] text-slate-400 uppercase font-bold">Lapangan</p><p className="text-lg font-extrabold text-slate-900 dark:text-white">{stats.courts}</p></div>
                            <div><p className="text-[11px] text-slate-400 uppercase font-bold">Booking</p><p className="text-lg font-extrabold text-slate-900 dark:text-white">{stats.bookings}</p></div>
                            <div><p className="text-[11px] text-slate-400 uppercase font-bold">Plan</p><p className="text-lg font-extrabold text-emerald-600 uppercase">{tenant.plan}</p></div>
                        </div>
                    </div>

                    {/* Owner Info */}
                    {owner && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Pemilik Venue</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-lg font-bold">{owner.name.charAt(0)}</div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{owner.name}</p>
                                    <p className="text-sm text-slate-500">{owner.email} • {owner.phone || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description & Rules */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white">Profil Venue</h3>
                        {tenant.description ? (
                            <div><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Deskripsi</p><p className="text-sm text-slate-700 dark:text-slate-300">{tenant.description}</p></div>
                        ) : <p className="text-sm text-slate-400 italic">Belum ada deskripsi</p>}

                        {tenant.rules && <div><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Aturan</p><p className="text-sm text-slate-700 dark:text-slate-300">{tenant.rules}</p></div>}

                        {tenant.facilities && (
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Fasilitas</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {tenant.facilities.split(', ').map(f => <span key={f} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-lg">{f}</span>)}
                                </div>
                            </div>
                        )}

                        {tenant.refund_policy && <div><p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Kebijakan Refund & Reschedule</p><p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{tenant.refund_policy}</p></div>}
                    </div>

                    {/* Monthly Revenue */}
                    {monthlyRevenue.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Pendapatan Per Bulan</h3>
                            <div className="space-y-2">
                                {monthlyRevenue.map(m => (
                                    <div key={m.month} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.month}</p>
                                            <p className="text-[11px] text-slate-400">{m.count} booking</p>
                                        </div>
                                        <p className="font-bold text-emerald-600">Rp {Number(m.revenue).toLocaleString('id-ID')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Photos */}
                    {tenant.photos && tenant.photos.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Image className="h-4 w-4" /> Foto Venue</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {tenant.photos.map((p, i) => <img key={i} src={`/storage/${p}`} alt="" className="w-full h-32 object-cover rounded-xl" />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
