import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { VenuraLogo } from '@/Components/VenuraLogo';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen flex bg-slate-950">
                {/* Left - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-700 relative overflow-hidden items-center justify-center p-12">
                    <div className="relative z-10 text-white max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <VenuraLogo className="h-12 w-12" />
                            <span className="font-extrabold text-3xl">Venura</span>
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight mb-4">
                            Booking Lapangan<br />Jadi Lebih Mudah
                        </h2>
                        <p className="text-emerald-100 text-lg">
                            Kelola jadwal, pantau booking real-time, dan atur tarif lapangan olahraga dalam satu platform.
                        </p>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full"></div>
                    <div className="absolute -top-10 -left-10 w-60 h-60 bg-white/5 rounded-full"></div>
                </div>

                {/* Right - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <VenuraLogo />
                            <span className="font-extrabold text-xl text-white">Venura</span>
                        </div>

                        <h1 className="text-2xl font-extrabold text-white mb-1">Selamat Datang</h1>
                        <p className="text-slate-400 text-sm mb-8">Masuk ke akun kamu untuk melanjutkan</p>

                        {status && (
                            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm"
                                    placeholder="nama@email.com"
                                    autoComplete="username"
                                    autoFocus
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition text-sm"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs text-slate-400">Ingat saya</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs text-emerald-400 hover:underline">
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="text-emerald-400 font-semibold hover:underline">
                                Daftar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
