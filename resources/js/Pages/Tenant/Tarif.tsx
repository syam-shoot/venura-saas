import { Head, router, useForm } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, TarifRule } from '@/types';
import { Input } from '@/Components/ui/input';
import { toast } from '@/Components/Toast';
import { Save } from 'lucide-react';

export default function Tarif({ tenant, rules, selectedType, types }: PageProps<{ tenant: Tenant; rules: TarifRule[]; selectedType: string; types: string[] }>) {
    const { data, setData, post, processing } = useForm({
        type: selectedType,
        rules: rules.map(r => ({ slot: r.slot, weekday_price: r.weekday_price, weekend_price: r.weekend_price })),
    });

    const update = (i: number, f: 'weekday_price'|'weekend_price', v: number) => {
        const u = [...data.rules]; u[i] = {...u[i],[f]:v}; setData('rules',u);
    };

    const changeType = (t: string) => router.get(`/${tenant.slug}/admin/tarif`, { type: t }, { preserveState: false });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${tenant.slug}/admin/tarif`, { onSuccess: () => toast('Tarif berhasil disimpan!') });
    };

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Atur Tarif" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Atur Tarif Per Jam</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Matriks Tarif</h3>
                            <p className="text-[11px] text-slate-400">Slot jam otomatis sesuai jam buka/tutup lapangan. Atur harga weekday & weekend.</p>
                        </div>
                        <select value={selectedType} onChange={e=>changeType(e.target.value)} className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white capitalize">
                            {types.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <form onSubmit={submit}>
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-900 dark:bg-slate-800">
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Slot Jam</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Weekday (Rp)</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Weekend (Rp)</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.rules.map((r,i)=>(
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">{r.slot}</td>
                                        <td className="p-3"><div className="flex items-center gap-1"><span className="text-[11px] text-slate-400">Rp</span><Input type="text" value={Number(r.weekday_price).toLocaleString('id-ID')} onChange={e=>update(i,'weekday_price',Number(e.target.value.replace(/\D/g,'')))} className="w-28"/></div></td>
                                        <td className="p-3"><div className="flex items-center gap-1"><span className="text-[11px] text-slate-400">Rp</span><Input type="text" value={Number(r.weekend_price).toLocaleString('id-ID')} onChange={e=>update(i,'weekend_price',Number(e.target.value.replace(/\D/g,'')))} className="w-28"/></div></td>
                                    </tr>
                                ))}
                                {data.rules.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400">Belum ada slot. Tambah lapangan dengan kategori ini terlebih dahulu.</td></tr>}
                            </tbody>
                        </table>
                        {data.rules.length > 0 && (
                            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button type="submit" disabled={processing} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20"><Save className="h-4 w-4"/>Simpan Tarif</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </TenantLayout>
    );
}
