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

        $bookings = $tenant->bookings()
            ->whereIn('status', ['approved', 'completed'])
            ->whereBetween('date', [$from, $to])
            ->join('payments', 'bookings.id', '=', 'payments.booking_id')
            ->whereIn('payments.status', ['paid', 'verified'])
            ->select(DB::raw('bookings.date, COUNT(*) as count, SUM(payments.amount) as revenue'))
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
