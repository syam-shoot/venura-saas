<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Tenant $tenant)
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $sevenDaysAgo = Carbon::today()->subDays(6);

        return Inertia::render('Tenant/Dashboard', [
            'tenant' => $tenant,
            'stats' => [
                'total_courts' => $tenant->courts()->count(),
                'total_bookings' => $tenant->bookings()->count(),
                'pending_bookings' => $tenant->bookings()->where('status', 'pending')->count(),
                'revenue_this_month' => (float) $tenant->bookings()
                    ->whereHas('payment', fn ($q) => $q->whereIn('status', ['paid', 'verified']))
                    ->where('date', '>=', $startOfMonth)
                    ->join('payments', 'bookings.id', '=', 'payments.booking_id')
                    ->whereIn('payments.status', ['paid', 'verified'])
                    ->sum('payments.amount'),
                'bookings_today' => $tenant->bookings()->whereDate('date', $today)->count(),
                'avg_rating' => round((float) $tenant->reviews()->avg('rating'), 1),
                'daily_bookings' => $tenant->bookings()
                    ->where('date', '>=', $sevenDaysAgo)
                    ->where('date', '<=', $today)
                    ->select(DB::raw('date, count(*) as count'))
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get()
                    ->map(fn ($r) => ['date' => $r->date->format('Y-m-d'), 'count' => $r->count]),
                'busiest_hours' => $tenant->bookings()
                    ->select(DB::raw('HOUR(start_time) as hour, count(*) as count'))
                    ->groupBy(DB::raw('HOUR(start_time)'))
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get(),
                'popular_courts' => $tenant->bookings()
                    ->join('courts', 'bookings.court_id', '=', 'courts.id')
                    ->select('courts.name', DB::raw('count(*) as count'))
                    ->groupBy('courts.name')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get(),
                'recent_bookings' => $tenant->bookings()->with('court')->latest()->take(5)->get(),
                'recent_reviews' => $tenant->reviews()->with('user')->latest()->take(3)->get(),
            ],
        ]);
    }
}
