import { Head, useForm, router, usePage } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant } from '@/types';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from '@/Components/Toast';
import { Save, Upload, Trash2, Image, Lock } from 'lucide-react';
import { useState } from 'react';

export default function Profile({ tenant }: PageProps<{ tenant: Tenant & { description?: string; rules?: string; facilities?: string; photos?: string[] } }>) {
    const user = usePage().props.auth.user as any;
    const { data, setData, put, processing } = useForm({
        name: tenant.name,
        address: tenant.address || '',
        city: (tenant as any).city || '',
        phone: tenant.phone || '',
        description: tenant.description || '',
        rules: tenant.rules || '',
        facilities: tenant.facilities || '',
        refund_policy: (tenant as any).refund_policy || '',
        allow_reschedule: (tenant as any).allow_reschedule || false,
    });

    const [uploading, setUploading] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/${tenant.slug}/admin/profile`, { onSuccess: () => toast('Profil venue berhasil disimpan!') });
    };

    const uploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;

        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('photos[]', f));

        setUploading(true);
        router.post(`/${tenant.slug}/admin/profile/photos`, formData, {
            forceFormData: true,
            onSuccess: () => { toast('Foto berhasil diupload!'); setUploading(false); },
            onError: () => { toast('Gagal upload. Max 1MB per foto.'); setUploading(false); },
        });
    };

    const deletePhoto = (photo: string) => {
        if (!confirm('Hapus foto ini?')) return;
        router.delete(`/${tenant.slug}/admin/profile/photos`, { data: { photo } });
    };

    return (
        <TenantLayout tenant={tenant}>
            <Head title="Profil Venue" />
            <div className="space-y-6 max-w-3xl">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profil Venue</h2>
                    <p className="text-sm text-slate-500 mt-1">Lengkapi profil agar pelanggan lebih yakin booking di venue kamu</p>
                </div>

                {/* Info Dasar */}
                <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Nama Venue</Label><Input value={data.name} onChange={e=>setData('name',e.target.value)} className="mt-1" required/></div>
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Kota</Label><Input value={data.city} onChange={e=>setData('city',e.target.value)} className="mt-1" required/></div>
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Alamat Lengkap</Label><Input value={data.address} onChange={e=>setData('address',e.target.value)} className="mt-1" required/></div>
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Telepon</Label><Input value={data.phone} onChange={e=>setData('phone',e.target.value)} className="mt-1" required/></div>
                    </div>

                    <div>
                        <Label className="text-[11px] font-bold uppercase text-slate-400">Deskripsi Venue</Label>
                        <textarea value={data.description} onChange={e=>setData('description',e.target.value)} rows={3} placeholder="Ceritakan tentang venue kamu, keunggulan, dll..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"/>
                    </div>

                    <div>
                        <Label className="text-[11px] font-bold uppercase text-slate-400">Aturan Venue</Label>
                        <textarea value={data.rules} onChange={e=>setData('rules',e.target.value)} rows={3} placeholder="Contoh: Wajib pakai sepatu futsal, Dilarang merokok di area lapangan, dll..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"/>
                    </div>

                    <div>
                        <Label className="text-[11px] font-bold uppercase text-slate-400">Fasilitas</Label>
                        <p className="text-[10px] text-slate-400 mb-3">Klik untuk memilih fasilitas yang tersedia</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {[
                                { name: 'Cafe & Resto', icon: 'M3 3h18v18H3V3zm3 3v4h4V6H6zm8 0v4h4V6h-4zm-8 8v4h4v-4H6zm8 0v4h4v-4h-4z' },
                                { name: 'Jual Makanan Ringan', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm-2-4H9V8h4v4z' },
                                { name: 'Jual Minuman', icon: 'M6 2l1.5 3.5L6 9v13h12V9l-1.5-3.5L18 2H6zm3 15H7v-2h2v2zm5 0h-2v-2h2v2z' },
                                { name: 'Musholla', icon: 'M12 3L2 12h3v8h14v-8h3L12 3zm0 3.5l5 4.5v6H7v-6l5-4.5z' },
                                { name: 'Parkir Mobil', icon: 'M5 11l1.5-4.5h11L19 11M3 15h18v-4H3v4zm2 3h2v2H5v-2zm12 0h2v2h-2v-2z' },
                                { name: 'Parkir Motor', icon: 'M19 7h-3l-1.5-3H9.5L8 7H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z' },
                                { name: 'Ruang Ganti', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' },
                                { name: 'Shower', icon: 'M7 2v11h3v9l7-12h-4l4-8z' },
                                { name: 'Toilet', icon: 'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 7H8v13h3v-6h2v6h3V9z' },
                                { name: 'Tribun Penonton', icon: 'M4 18h16v2H4v-2zm0-4h4v3H4v-3zm6 0h4v3h-4v-3zm6 0h4v3h-4v-3zM2 8h20v2H2V8zm2 3h4v3H4v-3zm6 0h4v3h-4v-3zm6 0h4v3h-4v-3z' },
                                { name: 'Wi-Fi', icon: 'M12 18c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.21-1.79-4-4-4zm0-4c-4.42 0-8 3.58-8 8h2c0-3.31 2.69-6 6-6s6 2.69 6 6h2c0-4.42-3.58-8-8-8zm0-4C6.48 6 2 10.48 2 16h2c0-4.42 3.58-8 8-8s8 3.58 8 8h2c0-5.52-4.48-10-10-10z' },
                                { name: 'Charging Station', icon: 'M7 2v11h3v9l7-12h-4l4-8H7z' },
                                { name: 'ATM', icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z' },
                                { name: 'Mini Market', icon: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 14.26l.04-.12L8.1 12h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0020 3H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 14.37 5.48 16 7 16h12v-2H7l1.1-2h7.45z' },
                                { name: 'Sound System', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
                                { name: 'AC/Kipas Angin', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z' },
                                { name: 'Gym Area', icon: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43 1.43 1.43 2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z' },
                                { name: 'Game Corner', icon: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
                                { name: 'Loker', icon: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6v-7h12v7zm0-9H6V4h12v7zm-7-1h2v2h-2V10zm0 8h2v2h-2v-2z' },
                            ].map(({ name, icon }) => {
                                const selected = data.facilities.includes(name);
                                return (
                                    <button key={name} type="button" onClick={() => {
                                        if (selected) {
                                            setData('facilities', data.facilities.split(', ').filter(x => x !== name).join(', '));
                                        } else {
                                            setData('facilities', data.facilities ? `${data.facilities}, ${name}` : name);
                                        }
                                    }} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium border transition text-left ${selected ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                        <svg className={`w-5 h-5 flex-shrink-0 ${selected ? 'text-emerald-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24"><path d={icon}/></svg>
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Label className="text-[11px] font-bold uppercase text-slate-400">Kebijakan Refund & Reschedule</Label>
                        <textarea value={data.refund_policy} onChange={e=>setData('refund_policy',e.target.value)} rows={4} placeholder="Contoh:&#10;• Refund 100% jika dibatalkan H-1&#10;• Refund 50% jika dibatalkan di hari H&#10;• Reschedule gratis max H-1&#10;• Reschedule di hari H dikenakan biaya 25%&#10;• Tidak ada refund untuk no-show" className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"/>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Izinkan Reschedule</p>
                            <p className="text-[11px] text-slate-400">Pelanggan bisa reschedule 1x, minimal 5 jam sebelum bermain</p>
                        </div>
                        <button type="button" onClick={() => setData('allow_reschedule', !data.allow_reschedule)} className={`w-11 h-6 rounded-full transition ${data.allow_reschedule ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${data.allow_reschedule ? 'translate-x-5.5 ml-[22px]' : 'translate-x-0.5 ml-[2px]'}`}/>
                        </button>
                    </div>

                    <button type="submit" disabled={processing} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition">
                        <Save className="h-4 w-4"/> {processing ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                </form>

                {/* Foto Venue */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Foto Venue</h3>
                            <p className="text-[11px] text-slate-400">Upload foto lapangan & fasilitas (max 1MB per foto)</p>
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm cursor-pointer shadow-md shadow-emerald-500/20 transition">
                            <Upload className="h-4 w-4"/> {uploading ? 'Uploading...' : 'Upload Foto'}
                            <input type="file" accept="image/*" multiple onChange={uploadPhotos} className="hidden" disabled={uploading}/>
                        </label>
                    </div>

                    {(tenant.photos && tenant.photos.length > 0) ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {tenant.photos.map((photo, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <img src={`/storage/${photo}`} alt="" className="w-full h-32 object-cover"/>
                                    <button onClick={() => deletePhoto(photo)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 className="h-3.5 w-3.5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
                            <Image className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2"/>
                            <p className="text-sm text-slate-400">Belum ada foto. Upload foto venue kamu.</p>
                        </div>
                    )}
                </div>

                {/* Owner Profile & Password */}
                <OwnerSection />
            </div>
        </TenantLayout>
    );
}

function OwnerSection() {
    const user = usePage().props.auth.user as any;
    const profileForm = useForm({ name: user.name, email: user.email, phone: user.phone || '' });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    const updateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/profile', { onSuccess: () => toast('Profil berhasil diupdate!') });
    };

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/password', { onSuccess: () => { passwordForm.reset(); toast('Password berhasil diganti!'); } });
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Profil Akun Owner</h3>
                <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Nama</Label><Input value={profileForm.data.name} onChange={e=>profileForm.setData('name',e.target.value)} className="mt-1" required/></div>
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Email</Label><Input type="email" value={profileForm.data.email} onChange={e=>profileForm.setData('email',e.target.value)} className="mt-1" required/></div>
                        <div><Label className="text-[11px] font-bold uppercase text-slate-400">Telepon</Label><Input value={profileForm.data.phone} onChange={e=>profileForm.setData('phone',e.target.value)} className="mt-1"/></div>
                    </div>
                    <button type="submit" disabled={profileForm.processing} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-500/20 transition">
                        <Save className="h-4 w-4"/> Simpan Profil
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Ganti Password</h3>
                </div>
                <form onSubmit={updatePassword} className="space-y-4">
                    <div><Label className="text-[11px] font-bold uppercase text-slate-400">Password Saat Ini</Label><Input type="password" value={passwordForm.data.current_password} onChange={e=>passwordForm.setData('current_password',e.target.value)} className="mt-1" placeholder="Masukkan password lama" required/>{passwordForm.errors.current_password && <p className="text-red-400 text-xs mt-1">{passwordForm.errors.current_password}</p>}</div>
                    <div><Label className="text-[11px] font-bold uppercase text-slate-400">Password Baru</Label><Input type="password" value={passwordForm.data.password} onChange={e=>passwordForm.setData('password',e.target.value)} className="mt-1" placeholder="Min. 8 karakter" required/>{passwordForm.errors.password && <p className="text-red-400 text-xs mt-1">{passwordForm.errors.password}</p>}</div>
                    <div><Label className="text-[11px] font-bold uppercase text-slate-400">Konfirmasi Password Baru</Label><Input type="password" value={passwordForm.data.password_confirmation} onChange={e=>passwordForm.setData('password_confirmation',e.target.value)} className="mt-1" placeholder="Ulangi password baru" required/></div>
                    <button type="submit" disabled={passwordForm.processing} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition">
                        <Lock className="h-4 w-4"/> Ganti Password
                    </button>
                </form>
            </div>
        </>
    );
}
