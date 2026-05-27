import { Head, Link } from '@inertiajs/react';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { Tenant } from '@/types';
import { Clock } from 'lucide-react';

export default function PendingVerification({ tenant }: { tenant: Tenant }) {
    return (
        <>
            <Head title="Menunggu Verifikasi" />
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center mb-6"><VenuraLogo className="h-12 w-12" /></div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Clock className="h-8 w-8 text-yellow-400" />
                        </div>
                        <h1 className="text-xl font-extrabold text-white mb-2">Menunggu Verifikasi</h1>
                        <p className="text-sm text-slate-400 mb-4">
                            Venue <strong className="text-white">{tenant.name}</strong> sedang dalam proses verifikasi oleh tim Venura.
                        </p>
                        <p className="text-xs text-slate-500 mb-6">
                            Proses verifikasi biasanya memakan waktu 1x24 jam. Kami akan mengirim notifikasi setelah venue kamu diverifikasi.
                        </p>
                        <Link href={route('logout')} method="post" as="button" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition text-sm">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
