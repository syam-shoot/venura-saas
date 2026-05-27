import { Head, router, useForm } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, Court } from '@/types';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Badge } from '@/Components/ui/badge';
import { useState } from 'react';

export default function Courts({ tenant, courts }: PageProps<{ tenant: Tenant; courts: Court[] }>) {
    const { data, setData, post, processing, reset } = useForm({ name: '', type: '', location: '', capacity: 10, price_per_hour: '' as any, open_time: '07:00', close_time: '23:00', weekend_open_time: '', weekend_close_time: '' });
    const [deleteTarget, setDeleteTarget] = useState<Court|null>(null);
    const submit = (e: React.FormEvent) => { e.preventDefault(); post(`/${tenant.slug}/admin/courts`, { onSuccess: () => reset() }); };
    const confirmDelete = () => { if(!deleteTarget) return; router.delete(`/${tenant.slug}/admin/courts/${deleteTarget.id}`, { onSuccess: () => setDeleteTarget(null) }); };

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Kelola Lapangan" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kelola Lapangan</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tambah Lapangan</h3>
                        <form onSubmit={submit} className="space-y-3">
                            <div><Label className="text-[11px] font-bold uppercase text-slate-400">Nama</Label><Input value={data.name} onChange={e=>setData('name',e.target.value)} className="mt-1" required/></div>
                            <div><Label className="text-[11px] font-bold uppercase text-slate-400">Kategori</Label>
                                <select value={data.type} onChange={e=>setData('type',e.target.value)} className="mt-1 w-full h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white" required>
                                    <option value="">Pilih</option><option value="Futsal">Futsal</option><option value="Bulu Tangkis">Bulu Tangkis</option><option value="Mini Soccer">Mini Soccer</option><option value="Padel">Padel</option><option value="Bola Basket">Bola Basket</option><option value="Bola Voli">Bola Voli</option><option value="Billiard">Billiard</option>
                                </select>
                            </div>
                            <div><Label className="text-[11px] font-bold uppercase text-slate-400">Harga/Jam (Rp)</Label><Input type="text" value={data.price_per_hour ? Number(data.price_per_hour).toLocaleString('id-ID') : ''} onChange={e=>setData('price_per_hour',e.target.value.replace(/\D/g,''))} placeholder="350.000" className="mt-1" required/></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Buka (Weekday)</Label><Input type="time" value={data.open_time} onChange={e=>setData('open_time',e.target.value)} className="mt-1"/></div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Tutup (Weekday)</Label><Input type="time" value={data.close_time} onChange={e=>setData('close_time',e.target.value)} className="mt-1"/></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Buka (Weekend)</Label><Input type="time" value={data.weekend_open_time} onChange={e=>setData('weekend_open_time',e.target.value)} className="mt-1" placeholder="Kosong = sama"/></div>
                                <div><Label className="text-[11px] font-bold uppercase text-slate-400">Tutup (Weekend)</Label><Input type="time" value={data.weekend_close_time} onChange={e=>setData('weekend_close_time',e.target.value)} className="mt-1" placeholder="Kosong = sama"/></div>
                            </div>
                            <p className="text-[10px] text-slate-400 -mt-2">* Kosongkan weekend jika sama dengan weekday</p>
                            <button type="submit" disabled={processing} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition">Simpan</button>
                        </form>
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-900 dark:bg-slate-800">
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Nama</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Kategori</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Harga</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {courts.map(c=>(
                                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="p-3"><Badge>{c.type}</Badge></td>
                                        <td className="p-3 text-slate-700 dark:text-slate-300">Rp {Number(c.price_per_hour).toLocaleString('id-ID')}</td>
                                        <td className="p-3 text-center"><button onClick={()=>setDeleteTarget(c)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button></td>
                                    </tr>
                                ))}
                                {courts.length===0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada lapangan</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="h-7 w-7 text-red-500" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Hapus Lapangan?</h3>
                            <p className="text-sm text-slate-500 mb-1">Kamu akan menghapus:</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{deleteTarget.name}</p>
                            <p className="text-xs text-slate-400 mt-1">Semua booking terkait juga akan dihapus. Aksi ini tidak bisa dibatalkan.</p>
                        </div>
                        <div className="flex border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                Batal
                            </button>
                            <button onClick={confirmDelete} className="flex-1 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-l border-slate-100 dark:border-slate-800 transition">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TenantLayout>
    );
}
