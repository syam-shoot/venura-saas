<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => [
                'total_tenants' => Tenant::count(),
                'active_tenants' => Tenant::where('is_active', true)->count(),
                'total_users' => User::count(),
                'total_bookings' => Booking::count(),
            ],
            'tenants' => Tenant::withCount('bookings')->latest()->get(),
        ]);
    }

    public function toggleTenant(Tenant $tenant)
    {
        $tenant->is_active = !$tenant->is_active;
        $tenant->save();
        return back();
    }
}
