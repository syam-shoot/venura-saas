import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { PasswordInput } from '@/Components/PasswordInput';
import { KeyRound } from 'lucide-react';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center mb-6"><VenuraLogo className="h-12 w-12" /></div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <KeyRound className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h1 className="text-xl font-extrabold text-white mb-2">Buat Kata Sandi Baru</h1>
                        <p className="text-sm text-slate-400 mb-6">Masukkan kata sandi baru untuk akun kamu</p>

                        <form onSubmit={submit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm"
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Kata Sandi Baru</label>
                                <PasswordInput
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm"
                                    placeholder="Min. 8 karakter"
                                    required
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Kombinasi huruf besar, angka & simbol</p>
                                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Konfirmasi Kata Sandi</label>
                                <PasswordInput
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm"
                                    placeholder="Ulangi kata sandi baru"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm"
                            >
                                {processing ? 'Memproses...' : 'Reset Kata Sandi'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
