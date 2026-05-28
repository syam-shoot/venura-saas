import { Head, Link, router } from '@inertiajs/react';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { LogOut, ArrowLeft } from 'lucide-react';

interface UserRow {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    tenant_name: string | null;
}

export default function Users({ users }: { users: UserRow[] }) {
    const toggle = (id: number) => router.patch(`/super-admin/users/${id}/toggle`);
    const verifyEmail = (id: number) => router.patch(`/super-admin/users/${id}/verify-email`);
    const deleteUser = (id: number) => { if (confirm('Hapus user ini beserta tenant yang dimiliki?')) router.delete(`/super-admin/users/${id}`); };

    return (
        <>
            <Head title="Kelola User - Super Admin" />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <VenuraLogo className="h-8 w-8" />
                        <div>
                            <span className="font-extrabold text-slate-900 dark:text-white">Venura</span>
                            <span className="text-[10px] text-slate-400 ml-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">SUPER ADMIN</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <DarkModeToggle />
                        <Link href={route('logout')} method="post" as="button" className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"><LogOut className="h-5 w-5" /></Link>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <Link href="/super-admin" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"><ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" /></Link>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Kelola User ({users.length})</h2>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead><tr className="bg-slate-900 dark:bg-slate-800">
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Nama</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Email</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Telepon</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Role</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Email Status</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Tenant</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Status</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-left">Terdaftar</th>
                                <th className="p-3 text-[11px] font-bold text-white uppercase text-center">Aksi</th>
                            </tr></thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{u.phone || '-'}</td>
                                        <td className="p-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{u.role || 'customer'}</span></td>
                                        <td className="p-3">
                                            {u.email_verified_at
                                                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600">VERIFIED</span>
                                                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600">UNVERIFIED</span>}
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{u.tenant_name || '-'}</td>
                                        <td className="p-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${u.is_active !== false ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                                {u.is_active !== false ? 'AKTIF' : 'NONAKTIF'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-500 text-[11px]">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-end gap-1.5 min-w-[180px]">
                                                <button onClick={() => toggle(u.id)} className={`text-[11px] font-bold px-2 py-1 rounded-lg transition ${u.is_active !== false ? 'bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100'}`}>
                                                    {u.is_active !== false ? 'Suspend' : 'Aktifkan'}
                                                </button>
                                                {!u.email_verified_at && u.role === 'tenant_admin' && (
                                                    <button onClick={() => verifyEmail(u.id)} className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition">Verify</button>
                                                )}
                                                <button onClick={() => deleteUser(u.id)} className="text-[11px] font-bold px-2 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
