<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use App\Notifications\BookingStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Tenant $tenant)
    {
        return Inertia::render('Tenant/Bookings', [
            'tenant' => $tenant,
            'bookings' => $tenant->bookings()->with(['court', 'user', 'payment'])->latest()->get(),
        ]);
    }

    public function updateStatus(Request $request, Tenant $tenant, Booking $booking)
    {
        if ($booking->tenant_id !== $tenant->id) abort(403);

        $request->validate(['status' => 'required|in:approved,rejected,completed,cancelled']);

        Log::info('Tenant booking status change', [
            'admin_id' => auth()->id(), 'tenant_id' => $tenant->id,
            'booking_id' => $booking->id, 'new_status' => $request->status,
        ]);

        $booking->status = $request->status;
        $booking->save();

        if (in_array($request->status, ['approved', 'rejected'])) {
            $booking->load(['court', 'tenant', 'user']);
            $booking->user->notify(new BookingStatusNotification($booking, $request->status));
        }

        if (in_array($request->status, ['cancelled', 'rejected']) && $booking->payment) {
            $booking->payment->update(['status' => 'refunded']);
        }

        return back();
    }

    public function updatePayment(Request $request, Tenant $tenant, Booking $booking)
    {
        if ($booking->tenant_id !== $tenant->id) abort(403);

        $request->validate(['status' => 'required|in:verified,refunded']);
        $booking->payment?->update(['status' => $request->status]);
        return back();
    }

    public function destroy(Tenant $tenant, Booking $booking)
    {
        if ($booking->tenant_id !== $tenant->id) abort(403);

        $booking->payment?->delete();
        $booking->delete();
        return back();
    }
}
