import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { Court, Booking, Tenant, TarifRule, Payment, PageProps } from '@/types';
import { LogOut, X } from 'lucide-react';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { toast } from '@/Components/Toast';
import { useState } from 'react';

interface Props { tenant: Tenant; courts: Court[]; bookings: Booking[]; selectedDate: string; tarifRules: Record<string, TarifRule[]>; myBookings: Booking[]; reviews: { id: number; rating: number; comment: string; user: { name: string }; created_at: string }[]; }

export default function Schedule({ tenant, courts, bookings, selectedDate, tarifRules, myBookings, reviews }: PageProps<Props>) {
    const user = usePage().props.auth?.user as any;
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<{ court: Court; time: string; slot: string; price: number }|null>(null);
    const [duration, setDuration] = useState(1);
    const [tab, setTab] = useState<'jadwal'|'riwayat'|'profil'>('jadwal');
    const [rescheduleBooking, setRescheduleBooking] = useState<Booking|null>(null);
    const [rescheduleData, setRescheduleData] = useState({ date: '', start_time: '', end_time: '' });
    const { data, setData, post, processing, reset, errors } = useForm({ court_id: 0, date: selectedDate, start_time: '', end_time: '', team_name: '', phone: '', notes: '', payment_method: 'transfer_bank' });

    const changeDate = (d: string) => router.get(`/${tenant.slug}`, { date: d }, { preserveState: true });
    const isWeekend = (d: string) => { const day = new Date(d).getDay(); return day===0||day===6; };

    const getPrice = (court: Court, time: string) => {
        const key = Object.keys(tarifRules).find(k => k.toLowerCase() === court.type.toLowerCase());
        const rules = key ? tarifRules[key] : [];
        const slotLabel = `${time} - ${String(parseInt(time)+1).padStart(2,'0')}:00`;
        const rule = rules.find(r => r.slot === slotLabel);
        return rule ? (isWeekend(selectedDate) ? Number(rule.weekend_price) : Number(rule.weekday_price)) : Number(court.price_per_hour);
    };

    const openBooking = (court: Court, time: string, slot: string) => {
        if (!user) { window.location.href = '/login'; return; }
        setSelected({ court, time, slot, price: getPrice(court, time) });
        setDuration(1);
        setData({ court_id: court.id, date: selectedDate, start_time: time, end_time: `${String(parseInt(time)+1).padStart(2,'0')}:00`, team_name: '', phone: '', notes: '', payment_method: 'transfer_bank' });
        setShowModal(true);
    };

    const changeDuration = (d: number) => { if(!selected) return; setDuration(d); setData('end_time',`${String(parseInt(selected.time)+d).padStart(2,'0')}:00`); };
    const getTotalPrice = () => { if(!selected) return 0; let t=0; for(let i=0;i<duration;i++) t+=getPrice(selected.court,`${String(parseInt(selected.time)+i).padStart(2,'0')}:00`); return t; };
    const submitBooking = (e: React.FormEvent) => { e.preventDefault(); post(`/${tenant.slug}/book`, { onSuccess: () => { setShowModal(false); reset(); toast('Booking berhasil!'); router.reload(); } }); };
    const markPaid = (id: number) => { router.patch(`/${tenant.slug}/book/${id}/pay`, {}, { onSuccess: () => toast('Pembayaran dikonfirmasi!') }); };
    const cancelBooking = (id: number) => { if(!confirm('Yakin batalkan booking ini?')) return; router.patch(`/${tenant.slug}/book/${id}/cancel`, {}, { onSuccess: () => toast('Booking dibatalkan.') }); };
    const openReschedule = (b: Booking) => { setRescheduleBooking(b); setRescheduleData({ date: b.date, start_time: b.start_time?.slice(0,5)||'', end_time: b.end_time?.slice(0,5)||'' }); };
    const submitReschedule = () => { if(!rescheduleBooking) return; router.patch(`/${tenant.slug}/book/${rescheduleBooking.id}/reschedule`, rescheduleData, { onSuccess: () => { setRescheduleBooking(null); toast('Berhasil direschedule!'); } }); };
    const [reviewBooking, setReviewBooking] = useState<Booking|null>(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const submitReview = () => { if(!reviewBooking) return; router.post(`/${tenant.slug}/book/${reviewBooking.id}/review`, reviewData, { onSuccess: () => { setReviewBooking(null); toast('Review berhasil!'); } }); };

    const getSlots = (court: Court) => {
        const weekend = isWeekend(selectedDate);
        const openH = parseInt(weekend && (court as any).weekend_open_time ? (court as any).weekend_open_time : court.open_time);
        const rawCloseH = parseInt(weekend && (court as any).weekend_close_time ? (court as any).weekend_close_time : court.close_time);
        const closeH = rawCloseH <= openH ? rawCloseH + 24 : rawCloseH;
        const now = new Date(); const currentH = now.getHours(); const isToday = selectedDate === now.toISOString().split('T')[0];
        return Array.from({length: closeH-openH}, (_,i) => {
            const h = openH+i; const displayH = h >= 24 ? h-24 : h; const nextH = (h+1)>=24?(h+1)-24:h+1;
            const t = `${String(displayH).padStart(2,'0')}:00`;
            const booked = bookings.find(b => b.court_id===court.id && (b.start_time?.slice(0,5)??'')<=t && (b.end_time?.slice(0,5)??'')>t);
            const isPast = isToday && h <= currentH;
            return { time: t, slot: `${t}-${String(nextH).padStart(2,'0')}:00`, status: isPast?'past':(booked?booked.status:'available'), price: getPrice(court,t) };
        });
    };

    const payLabel = (p?: Payment|null) => {
        if(!p) return { text:'UNPAID', color:'bg-red-100 text-red-600' };
        const m: Record<string,{text:string;color:string}> = { unpaid:{text:'UNPAID',color:'bg-red-100 text-red-600'}, paid:{text:'PAID',color:'bg-yellow-100 text-yellow-600'}, verified:{text:'VERIFIED',color:'bg-emerald-100 text-emerald-600'}, refunded:{text:'REFUNDED',color:'bg-slate-100 text-slate-500'} };
        return m[p.status] || m.unpaid;
    };

    return (
        <><Head title={tenant.name} />
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3"><VenuraLogo className="h-8 w-8" /><div><h1 className="font-extrabold text-slate-900 dark:text-white">{tenant.name}</h1><p className="text-[10px] text-slate-400">{tenant.address}</p></div></div>
                    <div className="flex items-center gap-2">
                        {user && user.role === 'tenant_admin' && (
                            <Link href={`/${tenant.slug}/admin`} className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                ← Kembali ke Admin
                            </Link>
                        )}
                        <DarkModeToggle />
                        {user ? <Link href={route('logout')} method="post" as="button" className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"><LogOut className="h-5 w-5"/></Link>
                            : <Link href="/login" className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold">Login</Link>}
                    </div>
                </div>
                {user && <div className="max-w-6xl mx-auto px-4 flex gap-1">
                    <button onClick={()=>setTab('jadwal')} className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 transition ${tab==='jadwal'?'border-emerald-500 text-emerald-600':'border-transparent text-slate-400'}`}>🏟️ Jadwal</button>
                    <button onClick={()=>setTab('riwayat')} className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 transition ${tab==='riwayat'?'border-emerald-500 text-emerald-600':'border-transparent text-slate-400'}`}>📋 Riwayat ({myBookings.length})</button>
                    <button onClick={()=>setTab('profil')} className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 transition ${tab==='profil'?'border-emerald-500 text-emerald-600':'border-transparent text-slate-400'}`}>👤 Profil</button>
                </div>}
            </header>

            <div className="max-w-6xl mx-auto px-4 py-5">
                {/* Jadwal Tab */}
                {tab==='jadwal' && <>
                    <div className="flex items-center gap-4 mb-6">
                        <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={e=>changeDate(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
                        <span className="text-sm text-slate-500">{new Date(selectedDate).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{isWeekend(selectedDate)?'WEEKEND':'WEEKDAY'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {courts.map(court => (
                            <div key={court.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800"><h3 className="font-bold text-slate-900 dark:text-white">{court.name}</h3><p className="text-[11px] text-slate-400">{court.type}</p></div>
                                <div className="p-3 grid grid-cols-4 gap-2">
                                    {getSlots(court).map(s=>(
                                        <button key={s.time} onClick={()=>s.status==='available'&&openBooking(court,s.time,s.slot)} disabled={s.status!=='available'}
                                            className={`px-1.5 py-2 rounded-xl text-center transition ${s.status==='available'?'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer':s.status==='past'?'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 cursor-not-allowed line-through':'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 cursor-not-allowed'}`}>
                                            <span className="block text-[11px] font-bold">{s.time}</span>
                                            <span className="block text-[9px] mt-0.5 opacity-70">{s.status==='available'?`Rp${(s.price/1000).toFixed(0)}rb`:s.status==='past'?'LEWAT':'BOOKED'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>}

                {/* Riwayat Tab */}
                {tab==='riwayat' && <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800"><h3 className="font-bold text-slate-900 dark:text-white">Riwayat Booking Saya</h3></div>
                    {myBookings.length===0 ? <div className="p-12 text-center text-slate-400">Belum ada booking</div> :
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {myBookings.map(b => {
                            const pl = payLabel(b.payment);
                            return (
                                <div key={b.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{b.court?.name}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${b.status==='pending'?'bg-yellow-100 text-yellow-700':b.status==='approved'?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{b.status.toUpperCase()}</span>
                                            </div>
                                            <p className="text-[12px] text-slate-500 mt-1">📅 {b.date} • ⏰ {b.start_time?.slice(0,5)}-{b.end_time?.slice(0,5)} • 👤 {b.team_name}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${pl.color}`}>{pl.text}</span>
                                                {b.payment && <span className="text-[10px] text-slate-400 capitalize">{b.payment.method.replace(/_/g,' ')}</span>}
                                                {b.payment?.status==='unpaid' && b.status!=='cancelled' && b.status!=='rejected' && (
                                                    <button onClick={()=>markPaid(b.id)} className="text-[10px] font-bold text-emerald-600 hover:underline ml-2">Konfirmasi Sudah Bayar</button>
                                                )}
                                                {b.status==='pending' && b.created_at && (new Date().getTime() - new Date(b.created_at).getTime()) < 5*60*1000 && (
                                                    <button onClick={()=>cancelBooking(b.id)} className="text-[10px] font-bold text-red-600 hover:underline ml-2">Batalkan</button>
                                                )}
                                                {b.status==='approved' && !b.rescheduled && (() => { const playTime = new Date(b.date + 'T' + (b.start_time?.slice(0,5)||'00:00')); return (playTime.getTime() - Date.now()) > 5*60*60*1000; })() && (
                                                    <button onClick={()=>openReschedule(b)} className="text-[10px] font-bold text-blue-600 hover:underline ml-2">Reschedule</button>
                                                )}
                                                {b.status==='completed' && (
                                                    <button onClick={()=>{setReviewBooking(b);setReviewData({rating:5,comment:''});}} className="text-[10px] font-bold text-purple-600 hover:underline ml-2">Beri Review</button>
                                                )}
                                            </div>
                                        </div>
                                        {b.payment && <p className="text-[12px] font-bold text-slate-900 dark:text-white">Rp {Number(b.payment.amount).toLocaleString('id-ID')}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>}
                </div>}
            </div>

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 pb-5">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800"><h3 className="font-bold text-slate-900 dark:text-white">⭐ Ulasan Pelanggan ({reviews.length})</h3></div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reviews.map(r => (
                                <div key={r.id} className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{r.user.name}</span>
                                        <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                                    </div>
                                    {r.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

                {/* Profil Tab */}
                {tab==='profil' && user && (
                    <div className="max-w-md space-y-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h3>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <div><p className="text-[11px] font-bold text-slate-400 uppercase">Total Booking</p><p className="text-sm font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl mt-1">{myBookings.length} booking</p></div>
                            </div>
                        </div>
                        <CustomerProfileForm user={user} tenant={tenant} />
                    </div>
                )}

            {/* Booking Modal */}
            {showModal && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
                            <div><h3 className="font-bold text-lg text-slate-900 dark:text-white">Booking</h3><p className="text-xs text-slate-400">{selected.court.name}</p></div>
                            <button onClick={()=>setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="h-5 w-5 text-slate-400"/></button>
                        </div>
                        <form onSubmit={submitBooking} className="p-5 space-y-4">
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-2">Durasi</label>
                                <div className="flex gap-2">{[1,2,3].map(d=><button key={d} type="button" onClick={()=>changeDuration(d)} className={`flex-1 py-2 rounded-xl text-sm font-bold ${duration===d?'bg-emerald-500 text-white':'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>{d} Jam</button>)}</div>
                                <p className="text-[11px] text-slate-400 mt-1">{selected.time} - {data.end_time}</p>
                            </div>
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Nama Tim</label><input type="text" value={data.team_name} onChange={e=>setData('team_name',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Contoh: Garuda FC, Tim Budi, dll" required/>{errors.team_name&&<p className="text-red-400 text-xs mt-1">{errors.team_name}</p>}</div>
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Kontak</label><input type="text" value={data.phone} onChange={e=>setData('phone',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Nomor WhatsApp aktif untuk konfirmasi" required/>{errors.phone&&<p className="text-red-400 text-xs mt-1">{errors.phone}</p>}</div>
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Catatan <span className="text-slate-500 normal-case">(opsional)</span></label><textarea value={data.notes} onChange={e=>setData('notes',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" rows={2} placeholder="Tulis catatan singkat jika ada permintaan khusus"/></div>
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-2">Pembayaran</label>
                                <div className="grid grid-cols-3 gap-2">{[{v:'transfer_bank',l:'Transfer'},{v:'e_wallet',l:'E-Wallet'},{v:'qris',l:'QRIS'},{v:'cash',l:'Cash'},{v:'dp',l:'DP 50%'}].map(m=><button key={m.v} type="button" onClick={()=>setData('payment_method',m.v)} className={`py-2 rounded-xl text-[11px] font-bold border transition ${data.payment_method===m.v?'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600':'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{m.l}</button>)}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm">
                                <div className="flex justify-between text-slate-500"><span>Waktu</span><span className="font-semibold text-slate-900 dark:text-white">{selected.time}-{data.end_time} ({duration}jam)</span></div>
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5 flex justify-between"><span className="font-bold text-slate-500">Total</span><span className="font-extrabold text-lg text-emerald-600">Rp {getTotalPrice().toLocaleString('id-ID')}</span></div>
                            </div>
                            {errors.start_time&&<p className="text-red-400 text-xs">{errors.start_time}</p>}
                            <button type="submit" disabled={processing} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 text-sm">{processing?'Memproses...':'Konfirmasi Booking'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-5 space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-slate-900 dark:text-white">Reschedule Booking</h3><button onClick={()=>setRescheduleBooking(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="h-5 w-5 text-slate-400"/></button></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Tanggal Baru</label><input type="date" value={rescheduleData.date} min={new Date().toISOString().split('T')[0]} onChange={e=>setRescheduleData({...rescheduleData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"/></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Mulai</label><input type="time" value={rescheduleData.start_time} onChange={e=>setRescheduleData({...rescheduleData, start_time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"/></div>
                            <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Selesai</label><input type="time" value={rescheduleData.end_time} onChange={e=>setRescheduleData({...rescheduleData, end_time: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"/></div>
                        </div>
                        <button onClick={submitReschedule} className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm">Simpan Reschedule</button>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-sm p-5 space-y-4">
                        <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-slate-900 dark:text-white">Beri Review</h3><button onClick={()=>setReviewBooking(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="h-5 w-5 text-slate-400"/></button></div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-2">Rating</label>
                            <div className="flex gap-1">{[1,2,3,4,5].map(s=><button key={s} type="button" onClick={()=>setReviewData({...reviewData,rating:s})} className={`text-2xl ${s<=reviewData.rating?'text-yellow-400':'text-slate-300'}`}>★</button>)}</div>
                        </div>
                        <div><label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Komentar</label><textarea value={reviewData.comment} onChange={e=>setReviewData({...reviewData,comment:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm h-24 resize-none" placeholder="Tulis pengalaman Anda..."/></div>
                        <button onClick={submitReview} className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-sm">Kirim Review</button>
                    </div>
                </div>
            )}
        </div></>
    );
}

function CustomerProfileForm({ user, tenant }: { user: any; tenant: any }) {
    const profileForm = useForm({ name: user.name, phone: user.phone || '' });
    const pwForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/profile', { onSuccess: () => toast('Profil berhasil diupdate!') });
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        pwForm.put('/password', { onSuccess: () => { pwForm.reset(); toast('Kata sandi berhasil diganti!'); } });
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Edit Profil</h4>
                <form onSubmit={updateProfile} className="space-y-3">
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Nama</label><input type="text" value={profileForm.data.name} onChange={e=>profileForm.setData('name',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required maxLength={255}/></div>
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Telepon</label><input type="tel" value={profileForm.data.phone} onChange={e=>profileForm.setData('phone',e.target.value.replace(/[^0-9+\-\s]/g,''))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" maxLength={20} placeholder="08xxxxxxxxxx"/></div>
                    <button type="submit" disabled={profileForm.processing} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition disabled:opacity-50">Simpan</button>
                </form>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Ganti Kata Sandi</h4>
                <form onSubmit={updatePassword} className="space-y-3">
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Kata Sandi Saat Ini</label><input type="password" value={pwForm.data.current_password} onChange={e=>pwForm.setData('current_password',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required/>{pwForm.errors.current_password&&<p className="text-red-400 text-xs mt-1">{pwForm.errors.current_password}</p>}</div>
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Kata Sandi Baru</label><input type="password" value={pwForm.data.password} onChange={e=>pwForm.setData('password',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required minLength={8}/>{pwForm.errors.password&&<p className="text-red-400 text-xs mt-1">{pwForm.errors.password}</p>}</div>
                    <div><label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Konfirmasi Kata Sandi</label><input type="password" value={pwForm.data.password_confirmation} onChange={e=>pwForm.setData('password_confirmation',e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required/></div>
                    <button type="submit" disabled={pwForm.processing} className="px-5 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition disabled:opacity-50">Ganti Kata Sandi</button>
                </form>
            </div>
        </>
    );
}
