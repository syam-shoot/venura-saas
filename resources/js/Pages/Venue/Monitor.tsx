import { Head } from '@inertiajs/react';
import { PageProps, Tenant } from '@/types';
import { useEffect, useState } from 'react';

const statusStyle: Record<string,{bg:string;text:string;dot:string}> = {
    BERMAIN:{bg:'bg-emerald-500/20',text:'text-emerald-400',dot:'bg-emerald-400'},
    BERSIAP:{bg:'bg-blue-500/20',text:'text-blue-400',dot:'bg-blue-400'},
    PENDING:{bg:'bg-yellow-500/20',text:'text-yellow-400',dot:'bg-yellow-400'},
    MENUNGGU:{bg:'bg-slate-500/20',text:'text-slate-400',dot:'bg-slate-400'},
    SELESAI:{bg:'bg-red-500/20',text:'text-red-400',dot:'bg-red-400'},
};

export default function Monitor({ tenant }: PageProps<{ tenant: Tenant }>) {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [clock, setClock] = useState(new Date());

    useEffect(() => {
        const fetchData = () => fetch(`/${tenant.slug}/api/schedule`).then(r=>r.json()).then(d=>{
            const order: Record<string,number> = {PENDING:0,MENUNGGU:1,BERSIAP:2,BERMAIN:3,SELESAI:4};
            d.sort((a:any,b:any)=>(order[a.status]??9)-(order[b.status]??9));
            setSchedule(d);
        }).catch(()=>{});
        fetchData();
        const i1 = setInterval(fetchData, 10000);
        const i2 = setInterval(()=>setClock(new Date()), 1000);
        return ()=>{clearInterval(i1);clearInterval(i2);};
    }, []);

    return (
        <><Head title={`Monitor - ${tenant.name}`} />
        <div className="min-h-screen bg-slate-950 text-white font-mono">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center text-xs text-slate-400">
                <span>⚠️ FIDS {tenant.name.toUpperCase()} MONITOR</span>
                <div className="flex items-center gap-4">
                    <span>Auto Update: 10s</span>
                    <a href={`/${tenant.slug}/admin`} className="text-emerald-400 hover:underline">← Admin</a>
                </div>
            </div>
            <div className="bg-slate-900/50 px-6 py-6 border-b border-slate-800">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">JADWAL REALTIME — HARI INI</h1>
                        <p className="text-sm text-slate-400 mt-1">{clock.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400 tabular-nums">{clock.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</p>
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-slate-800/80 border-b border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <div className="col-span-2">JAM</div><div className="col-span-4">LAPANGAN</div><div className="col-span-3">PENYEWA</div><div className="col-span-1">DURASI</div><div className="col-span-2 text-center">STATUS</div>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {schedule.length===0 && <div className="px-6 py-12 text-center text-slate-600">Tidak ada jadwal hari ini</div>}
                        {schedule.map((r:any,i:number)=>(
                            <div key={i} className="grid grid-cols-12 gap-2 px-6 py-4 items-center hover:bg-slate-800/30 transition">
                                <div className="col-span-2"><span className="text-amber-300 font-bold text-lg">{r.time}</span><span className="text-slate-500 text-xs ml-1">WIB</span></div>
                                <div className="col-span-4 text-white font-semibold text-sm">{r.court}</div>
                                <div className="col-span-3 text-slate-300 text-sm">{r.team}</div>
                                <div className="col-span-1 text-slate-400 text-sm">{r.duration}</div>
                                <div className="col-span-2 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold ${statusStyle[r.status]?.bg} ${statusStyle[r.status]?.text}`}>
                                        {(r.status==='BERMAIN'||r.status==='BERSIAP')&&<span className={`w-2 h-2 rounded-full ${statusStyle[r.status]?.dot} animate-pulse`}/>}
                                        {r.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 text-xs mt-4 text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400"/>Pending</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"/>Menunggu</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"/>Bersiap</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"/>Bermain</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"/>Selesai</span>
                </div>
            </div>
        </div></>
    );
}
