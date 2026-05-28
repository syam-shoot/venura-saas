<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request, Tenant $tenant)
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        // Daily report (filtered)
        $daily = DB::table('bookings')
            ->leftJoin('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('bookings.tenant_id', $tenant->id)
            ->whereIn('bookings.status', ['approved', 'completed'])
            ->whereBetween('bookings.date', [$from, $to])
            ->select('bookings.date', DB::raw('COUNT(DISTINCT bookings.id) as count'), DB::raw('COALESCE(SUM(payments.amount), 0) as revenue'))
            ->groupBy('bookings.date')
            ->orderBy('bookings.date')
            ->get();

        // Monthly report (last 6 months)
        $monthly = DB::table('bookings')
            ->leftJoin('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('bookings.tenant_id', $tenant->id)
            ->whereIn('bookings.status', ['approved', 'completed'])
            ->where('bookings.date', '>=', now()->subMonths(6)->startOfMonth()->toDateString())
            ->select(DB::raw('DATE_FORMAT(bookings.date, "%Y-%m") as month'), DB::raw('COUNT(DISTINCT bookings.id) as count'), DB::raw('COALESCE(SUM(payments.amount), 0) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Today's revenue
        $today = DB::table('bookings')
            ->leftJoin('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('bookings.tenant_id', $tenant->id)
            ->whereIn('bookings.status', ['approved', 'completed'])
            ->where('bookings.date', now()->toDateString())
            ->select(DB::raw('COALESCE(SUM(payments.amount), 0) as revenue'), DB::raw('COUNT(DISTINCT bookings.id) as count'))
            ->first();

        return Inertia::render('Tenant/Report', [
            'tenant' => $tenant,
            'report' => $daily,
            'monthly' => $monthly,
            'from' => $from,
            'to' => $to,
            'totalRevenue' => $daily->sum('revenue'),
            'totalBookings' => $daily->sum('count'),
            'todayRevenue' => $today->revenue ?? 0,
            'todayBookings' => $today->count ?? 0,
        ]);
    }
}
