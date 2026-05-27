<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Tenant $tenant)
    {
        return Inertia::render('Tenant/Dashboard', [
            'tenant' => $tenant,
            'stats' => [
                'total_courts' => $tenant->courts()->count(),
                'total_bookings' => $tenant->bookings()->count(),
                'pending_bookings' => $tenant->bookings()->where('status', 'pending')->count(),
                'recent_bookings' => $tenant->bookings()->with('court')->latest()->take(5)->get(),
            ],
        ]);
    }
}
