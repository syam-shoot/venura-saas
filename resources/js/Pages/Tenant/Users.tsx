import { Head, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant, User } from '@/types';

export default function Users({ tenant, users }: PageProps<{ tenant: Tenant; users: (User & { bookings_count: number })[] }>) {
    const toggle = (id: number) => router.patch(`/${tenant.slug}/admin/users/${id}/toggle`);

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Pelanggan" />
            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Pelanggan</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead><tr className="bg-slate-900 dark:bg-slate-800">
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Nama</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Telepon</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Booking</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Status</th>
                            <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map(u=>(
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                                    <td className="p-3 text-slate-500">{u.phone || "-"}</td>
                                    <td className="p-3 text-slate-700 dark:text-slate-300">{u.bookings_count}</td>
                                    <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${u.is_active?'bg-emerald-100 text-emerald-600':'bg-red-100 text-red-600'}`}>{u.is_active?'AKTIF':'NONAKTIF'}</span></td>
                                    <td className="p-3 text-center"><button onClick={()=>toggle(u.id)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${u.is_active?'bg-red-50 text-red-600':'bg-emerald-50 text-emerald-600'}`}>{u.is_active?'Nonaktifkan':'Aktifkan'}</button></td>
                                </tr>
                            ))}
                            {users.length===0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">Belum ada pelanggan</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </TenantLayout>
    );
}
