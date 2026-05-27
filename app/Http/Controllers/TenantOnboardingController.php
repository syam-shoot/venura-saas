<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TenantOnboardingController extends Controller
{
    public function create()
    {
        if (auth()->user()->tenants()->exists()) {
            $tenant = auth()->user()->tenants()->first();
            return redirect("/{$tenant->slug}/admin");
        }

        return Inertia::render('Onboarding');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $i = 1;
        while (Tenant::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $i++;
        }

        $tenant = Tenant::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'phone' => $validated['phone'],
            'email' => $request->user()->email,
        ]);

        $tenant->users()->attach($request->user()->id, ['role' => 'owner']);

        // Update user role
        $request->user()->update(['role' => 'tenant_admin']);

        return redirect("/{$slug}/admin");
    }
}
