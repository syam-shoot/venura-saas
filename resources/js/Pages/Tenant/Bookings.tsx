import { Head, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, Booking } from '@/types';
import { Check, X, Ban, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/Components/ui/badge';

const sv: Record<string, 'success'|'warning'|'destructive'|'secondary'> = { pending:'warning', approved:'success', rejected:'destructive', cancelled:'secondary', completed:'default' as any };

export default function Bookings({ tenant, bookings }: PageProps<{ tenant: Tenant; bookings: Booking[] }>) {
    const [detail, setDetail] = useState<Booking|null>(null);
    const act = (id: number, status: string) => router.patch(`/${tenant.slug}/admin/bookings/${id}/status`, { status });
    const pay = (id: number, status: string) => router.patch(`/${tenant.slug}/admin/bookings/${id}/payment`, { status });
    const del = (id: number) => { if(confirm('Hapus booking?')) router.delete(`/${tenant.slug}/admin/bookings/${id}`); };

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Kelola Booking" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kelola Booking</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="bg-slate-900 dark:bg-slate-800">
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Booking</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Lapangan</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Jadwal</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Status</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Bayar</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3"><p className="font-semibold text-slate-900 dark:text-white">{b.team_name}</p><p className="text-[11px] text-slate-400">{b.user?.name}</p></td>
                                    <td className="p-3 text-slate-600 dark:text-slate-400">{b.court?.name}</td>
                                    <td className="p-3"><span className="font-mono text-slate-900 dark:text-white">{b.date}</span><br/><span className="text-[11px] text-slate-400">{b.start_time?.slice(0,5)}-{b.end_time?.slice(0,5)}</span></td>
                                    <td className="p-3"><Badge variant={sv[b.status]}>{b.status}</Badge></td>
                                    <td className="p-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${b.payment?.status==='verified'?'bg-emerald-100 text-emerald-600':b.payment?.status==='paid'?'bg-yellow-100 text-yellow-600':'bg-red-100 text-red-600'}`}>{b.payment?.status?.toUpperCase()||'UNPAID'}</span>
                                        {b.payment?.status==='paid' && <button onClick={()=>pay(b.id,'verified')} className="block text-[10px] text-emerald-600 font-bold mt-1 hover:underline">Verifikasi</button>}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {b.status==='pending' && <><button onClick={()=>act(b.id,'approved')} disabled={b.payment?.method !== 'cash' && b.payment?.status === 'unpaid'} className={`h-7 px-2 text-[10px] font-bold rounded-lg ${b.payment?.method !== 'cash' && b.payment?.status === 'unpaid' ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white'}`} title={b.payment?.method !== 'cash' && b.payment?.status === 'unpaid' ? 'Menunggu konfirmasi pembayaran' : ''}>Terima</button><button onClick={()=>act(b.id,'rejected')} className="h-7 px-2 text-[10px] font-bold bg-red-500 text-white rounded-lg">Tolak</button></>}
                                            {(b.status==='approved'||b.status==='pending') && <button onClick={()=>act(b.id,'cancelled')} className="h-7 px-2 text-[10px] font-bold bg-orange-100 text-orange-600 rounded-lg">Batal</button>}
                                            <button onClick={()=>setDetail(b)} className="h-7 px-2 text-slate-400 hover:text-slate-600"><Eye className="h-3.5 w-3.5"/></button>
                                            <button onClick={()=>del(b.id)} className="h-7 px-2 text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length===0 && <tr><td colSpan={6} className="p-12 text-center text-slate-400">Belum ada booking</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {detail && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={()=>setDetail(null)}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-6" onClick={e=>e.stopPropagation()}>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">{detail.team_name}</h3>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-slate-400">Pemesan:</span> {detail.user?.name}</p>
                        <p><span className="text-slate-400">Kontak:</span> {detail.phone}</p>
                        <p><span className="text-slate-400">Lapangan:</span> {detail.court?.name}</p>
                        <p><span className="text-slate-400">Jadwal:</span> {detail.date} {detail.start_time?.slice(0,5)}-{detail.end_time?.slice(0,5)}</p>
                        <p><span className="text-slate-400">Catatan:</span> {detail.notes||'-'}</p>
                    </div>
                </div>
            </div>}
        </TenantLayout>
    );
}
