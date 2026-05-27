import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Tenant } from '@/types';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { Search, MapPin, LogOut, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    venues: (Tenant & { courts_count: number })[];
    cities: string[];
    filters: { city?: string; search?: string };
}

export default function Explore({ venues, cities, filters }: PageProps<Props>) {
    const [search, setSearch] = useState(filters.search || '');
    const [detailVenue, setDetailVenue] = useState<any>(null);

    const doSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/explore', { search, city: filters.city }, { preserveState: true });
    };

    const filterCity = (city: string) => {
        router.get('/explore', { city: city || undefined, search: filters.search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Cari Venue" />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <VenuraLogo className="h-8 w-8" />
                            <span className="font-extrabold text-lg text-slate-900 dark:text-white">Venura</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DarkModeToggle />
                            <Link href={route('logout')} method="post" as="button" className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl">
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto px-4 py-6">
                    {/* Search & Filter */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">Cari Venue Olahraga</h1>
                        <p className="text-sm text-slate-500 mb-4">Temukan lapangan di kotamu dan booking langsung</p>

                        <form onSubmit={doSearch} className="flex gap-3 mb-4">
                            <div className="flex-grow relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama venue atau kota..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition">Cari</button>
                        </form>

                        {/* City filter */}
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => filterCity('')} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${!filters.city ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}>
                                Semua Kota
                            </button>
                            {cities.map((city) => (
                                <button key={city} onClick={() => filterCity(city)} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${filters.city === city ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'}`}>
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Venue Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {venues.map((venue) => (
                            <div key={venue.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-800 transition group">
                                {(venue as any).photos?.[0] && (
                                    <img src={`/storage/${(venue as any).photos[0]}`} alt={venue.name} className="w-full h-36 object-cover"/>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">{venue.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                <span className="text-[12px] text-slate-500">{(venue as any).city || venue.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {(venue as any).description && (
                                        <p className="text-[12px] text-slate-500 mt-2 line-clamp-2">{(venue as any).description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-[12px] text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <span>🏟️ {venue.courts_count} lapangan</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => setDetailVenue(venue)} className="flex-1 text-center py-2 text-[12px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                                            Detail
                                        </button>
                                        <Link href={`/${venue.slug}`} className="flex-1 text-center py-2 text-[12px] font-bold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition">
                                            Booking
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {venues.length === 0 && (
                        <div className="text-center py-16">
                            <MapPin className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-slate-400 font-medium">Tidak ada venue ditemukan</p>
                            <p className="text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {detailVenue && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDetailVenue(null)}>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            {detailVenue.photos?.[0] && (
                                <img src={`/storage/${detailVenue.photos[0]}`} alt={detailVenue.name} className="w-full h-48 object-cover rounded-t-2xl"/>
                            )}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{detailVenue.name}</h2>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5"/> {detailVenue.city} • {detailVenue.address}</p>
                                    </div>
                                    <button onClick={() => setDetailVenue(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="h-5 w-5 text-slate-400"/></button>
                                </div>

                                {detailVenue.phone && <p className="text-sm text-slate-600 dark:text-slate-400">📞 {detailVenue.phone}</p>}

                                {detailVenue.description && (
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1">Deskripsi</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{detailVenue.description}</p>
                                    </div>
                                )}

                                {detailVenue.facilities && (
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Fasilitas</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {detailVenue.facilities.split(', ').map((f: string) => (
                                                <span key={f} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium rounded-lg">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {detailVenue.rules && (
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1">Aturan Venue</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{detailVenue.rules}</p>
                                    </div>
                                )}

                                {detailVenue.refund_policy && (
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-1">Kebijakan Refund & Reschedule</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{detailVenue.refund_policy}</p>
                                    </div>
                                )}

                                {detailVenue.photos?.length > 1 && (
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">Foto</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {detailVenue.photos.map((p: string, i: number) => (
                                                <img key={i} src={`/storage/${p}`} alt="" className="w-full h-20 object-cover rounded-lg"/>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Link href={`/${detailVenue.slug}`} className="block w-full text-center py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition text-sm">
                                    Lihat Jadwal & Booking
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
