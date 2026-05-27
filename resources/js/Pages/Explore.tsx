import { Head, Link, router } from '@inertiajs/react';
import { PageProps, Tenant } from '@/types';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { Search, MapPin, LogOut } from 'lucide-react';
import { useState } from 'react';

interface Props {
    venues: (Tenant & { courts_count: number })[];
    cities: string[];
    filters: { city?: string; search?: string };
}

export default function Explore({ venues, cities, filters }: PageProps<Props>) {
    const [search, setSearch] = useState(filters.search || '');

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
                            <Link key={venue.id} href={`/${venue.slug}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-800 transition group">
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">{venue.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                <span className="text-[12px] text-slate-500">{venue.city || venue.address}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 uppercase">{venue.plan}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[12px] text-slate-400">
                                        <span>🏟️ {venue.courts_count} lapangan</span>
                                        {venue.phone && <span>📞 {venue.phone}</span>}
                                    </div>
                                </div>
                            </Link>
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
            </div>
        </>
    );
}
