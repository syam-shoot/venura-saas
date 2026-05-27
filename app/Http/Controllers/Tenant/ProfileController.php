<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Tenant $tenant)
    {
        return Inertia::render('Tenant/Profile', ['tenant' => $tenant]);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string|max:1000',
            'rules' => 'nullable|string|max:1000',
            'facilities' => 'nullable|string|max:500',
            'refund_policy' => 'nullable|string|max:1000',
            'reschedule_policy' => 'nullable|string|max:1000',
        ]);

        $tenant->update($validated);

        return back();
    }

    public function uploadPhotos(Request $request, Tenant $tenant)
    {
        $request->validate([
            'photos.*' => 'required|image|max:1024', // max 1MB per foto
        ]);

        $existing = $tenant->photos ?? [];

        foreach ($request->file('photos', []) as $photo) {
            $path = $photo->store("venues/{$tenant->slug}", 'public');
            $existing[] = $path;
        }

        $tenant->update(['photos' => $existing]);

        return back();
    }

    public function deletePhoto(Request $request, Tenant $tenant)
    {
        $request->validate(['photo' => 'required|string']);

        $photos = $tenant->photos ?? [];
        $photos = array_values(array_filter($photos, fn($p) => $p !== $request->photo));

        Storage::disk('public')->delete($request->photo);
        $tenant->update(['photos' => $photos]);

        return back();
    }
}
