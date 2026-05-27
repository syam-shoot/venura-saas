import { Head, Link, useForm } from '@inertiajs/react';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { Mail } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verifikasi Email" />
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <VenuraLogo className="h-12 w-12" />
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Mail className="h-8 w-8 text-emerald-400" />
                        </div>

                        <h1 className="text-xl font-extrabold text-white mb-2">Verifikasi Email Kamu</h1>
                        <p className="text-sm text-slate-400 mb-6">
                            Terima kasih sudah mendaftar! Kami sudah mengirim link verifikasi ke email kamu. Klik link tersebut untuk mengaktifkan akun.
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                                ✅ Link verifikasi baru telah dikirim ke email kamu!
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition text-sm"
                            >
                                Logout
                            </Link>
                        </form>
                    </div>

                    <p className="text-xs text-slate-600 mt-6">
                        Tidak menerima email? Cek folder spam atau kirim ulang.
                    </p>
                </div>
            </div>
        </>
    );
}
