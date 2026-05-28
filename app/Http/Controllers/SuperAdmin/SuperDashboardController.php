<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SuperDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'total_tenants' => Tenant::count(),
                'active_tenants' => Tenant::where('is_active', true)->where('is_verified', true)->count(),
                'pending_tenants' => Tenant::where('is_verified', false)->count(),
                'total_users' => User::count(),
                'total_bookings' => Booking::count(),
                'total_courts' => \App\Models\Court::count(),
            ],
            'courtsByType' => \App\Models\Court::select('type', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->groupBy('type')
                ->orderByDesc('total')
                ->get(),
            'tenants' => Tenant::withCount('bookings')->latest()->get(),
        ]);
    }

    public function showTenant(Tenant $tenant)
    {
        $owner = $tenant->users()->wherePivot('role', 'owner')->first();

        return Inertia::render('SuperAdmin/TenantDetail', [
            'tenant' => $tenant,
            'owner' => $owner,
            'stats' => [
                'courts' => $tenant->courts()->count(),
                'bookings' => $tenant->bookings()->count(),
            ],
        ]);
    }

    public function toggleTenant(Tenant $tenant)
    {
        $tenant->is_active = !$tenant->is_active;
        $tenant->save();
        return back();
    }

    public function verifyTenant(Tenant $tenant)
    {
        $tenant->is_verified = true;
        $tenant->is_active = true;
        $tenant->save();
        return back();
    }

    public function createMitra(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'venue_name' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make('password123'),
        ]);
        $user->role = 'tenant_admin';
        $user->email_verified_at = now();
        $user->save();

        // Create tenant
        $slug = Str::slug($request->venue_name);
        $i = 1;
        while (Tenant::where('slug', $slug)->exists()) { $slug = Str::slug($request->venue_name) . '-' . $i++; }

        $tenant = Tenant::create([
            'name' => $request->venue_name,
            'slug' => $slug,
            'address' => $request->address,
            'city' => $request->city,
            'phone' => $request->phone,
            'email' => $request->email,
            'is_verified' => true,
            'is_active' => true,
        ]);

        $tenant->users()->attach($user->id, ['role' => 'owner']);

        return back();
    }
}
