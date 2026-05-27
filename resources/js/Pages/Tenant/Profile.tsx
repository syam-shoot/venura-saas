import { Head, useForm, router } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import { PageProps, Tenant } from '@/types';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from '@/Components/Toast';
import { Save, Upload, Trash2, Image } from 'lucide-react';
import { useState } from 'react';

export default function Profile({ tenant }: PageProps<{ tenant: Tenant & { description?: string; rules?: string; facilities?: string; photos?: string[] } }>) {
    const { data, setData, put, processing } = useForm({
        name: tenant.name,
        address: tenant.address || '',
        city: (tenant as any).city || '',
        phone: tenant.phone || '',
        description: tenant.description || '',
        rules: tenant.rules || '',
        facilities: tenant.facilities || '',
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
                        <textarea value={data.facilities} onChange={e=>setData('facilities',e.target.value)} rows={2} placeholder="Contoh: Parkir luas, Musholla, Kantin, Ruang ganti, Toilet, WiFi..." className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-emerald-500 outline-none"/>
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
            </div>
        </TenantLayout>
    );
}
