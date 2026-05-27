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

        $bookings = DB::table('bookings')
            ->leftJoin('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('bookings.tenant_id', $tenant->id)
            ->whereIn('bookings.status', ['approved', 'completed'])
            ->whereBetween('bookings.date', [$from, $to])
            ->select(
                'bookings.date',
                DB::raw('COUNT(DISTINCT bookings.id) as count'),
                DB::raw('COALESCE(SUM(payments.amount), 0) as revenue')
            )
            ->groupBy('bookings.date')
            ->orderBy('bookings.date')
            ->get();

        return Inertia::render('Tenant/Report', [
            'tenant' => $tenant,
            'report' => $bookings,
            'from' => $from,
            'to' => $to,
            'totalRevenue' => $bookings->sum('revenue'),
            'totalBookings' => $bookings->sum('count'),
        ]);
    }
}
