import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { LayoutDashboard, CalendarCheck, Layers, Clock, Users, LogOut, Menu, X, Monitor, Building2 } from 'lucide-react';
import { DarkModeToggle } from '@/Components/DarkModeToggle';
import { VenuraLogo } from '@/Components/VenuraLogo';
import { Tenant } from '@/types';

const getNavItems = (slug: string) => [
    { href: `/${slug}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${slug}/admin/bookings`, label: 'Kelola Booking', icon: CalendarCheck },
    { href: `/${slug}/admin/courts`, label: 'Kelola Lapangan', icon: Layers },
    { href: `/${slug}/admin/tarif`, label: 'Atur Tarif', icon: Clock },
    { href: `/${slug}/admin/users`, label: 'Pelanggan', icon: Users },
    { href: `/${slug}/admin/profile`, label: 'Profil Venue', icon: Building2 },
    { href: `/${slug}/monitor`, label: 'FIDS Monitor', icon: Monitor },
];

export default function TenantLayout({ children, tenant }: PropsWithChildren<{ tenant: Tenant }>) {
    const user = usePage().props.auth.user as any;
    const [open, setOpen] = useState(false);
    const navItems = getNavItems(tenant.slug);
    const currentPath = window.location.pathname;

    const sidebar = (
        <>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <VenuraLogo className="h-8 w-8" />
                    <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white block">{tenant.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase">{tenant.plan} plan</span>
                    </div>
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const active = currentPath === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition ${active ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}>
                                <item.icon className="h-4 w-4" /> {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-6 mt-auto border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">{user.name?.charAt(0)}</div>
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">{user.name}</p>
                    </div>
                    <DarkModeToggle />
                </div>
                <div className="flex gap-2">
                    <Link href={`/${tenant.slug}`} className="flex-1 text-center text-[11px] font-bold px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition">Lihat Venue</Link>
                    <Link href={route('logout')} method="post" as="button" className="px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"><LogOut className="h-4 w-4" /></Link>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
            <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
                <span className="font-extrabold text-slate-900 dark:text-white">{tenant.name}</span>
                <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            </div>
            {open && <div className="md:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">{sidebar}</aside></div>}
            <div className="flex">
                <aside className="hidden md:flex md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex-col min-h-screen sticky top-0">{sidebar}</aside>
                <main className="flex-grow p-6 sm:p-8">{children}</main>
            </div>
        </div>
    );
}
