<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Court;
use App\Models\Review;
use App\Models\Tenant;
use App\Models\TarifRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function schedule(Request $request, Tenant $tenant)
    {
        $date = $request->query('date', now()->toDateString());
        $courts = $tenant->courts()->where('is_active', true)->get();
        $bookings = $tenant->bookings()
            ->where('date', $date)
            ->whereIn('status', ['approved', 'pending'])
            ->get(['id', 'court_id', 'date', 'start_time', 'end_time', 'status']);
        $tarifRules = $tenant->tarifRules()->get()->groupBy('type');

        $myBookings = [];
        if ($request->user()) {
            $myBookings = $request->user()->bookings()
                ->where('tenant_id', $tenant->id)
                ->with(['court', 'payment'])
                ->latest()
                ->take(10)
                ->get();
        }

        return Inertia::render('Venue/Schedule', [
            'tenant' => $tenant,
            'courts' => $courts,
            'bookings' => $bookings,
            'selectedDate' => $date,
            'tarifRules' => $tarifRules,
            'myBookings' => $myBookings,
            'reviews' => $tenant->reviews()->with('user')->latest()->take(20)->get(),
        ]);
    }

    public function monitor(Tenant $tenant)
    {
        return Inertia::render('Venue/Monitor', ['tenant' => $tenant]);
    }

    public function apiSchedule(Request $request, Tenant $tenant)
    {
        $now = now();
        $bookings = $tenant->bookings()->with('court')
            ->where('date', $now->toDateString())
            ->whereIn('status', ['pending', 'approved', 'completed'])
            ->orderBy('start_time')
            ->get()
            ->map(function ($b) use ($now) {
                $startH = (int) substr($b->start_time, 0, 2);
                $startM = (int) substr($b->start_time, 3, 2);
                $endH = (int) substr($b->end_time, 0, 2);
                $currentMin = $now->hour * 60 + $now->minute;
                $startMin = $startH * 60 + $startM;
                $endMin = $endH * 60;

                if ($b->status === 'pending') $status = 'PENDING';
                elseif ($b->status === 'completed') $status = 'SELESAI';
                elseif ($currentMin >= $startMin && $currentMin < $endMin) $status = 'BERMAIN';
                elseif ($currentMin >= ($startMin - 10) && $currentMin < $startMin) $status = 'BERSIAP';
                elseif ($currentMin < $startMin) $status = 'MENUNGGU';
                else $status = 'SELESAI';

                $parts = explode(' ', $b->team_name);
                $masked = collect($parts)->map(fn($p) => mb_substr($p, 0, 3) . '***')->implode(' ');

                return [
                    'time' => substr($b->start_time, 0, 5),
                    'court' => $b->court->name ?? '-',
                    'team' => $masked,
                    'duration' => ($endH - $startH) . ' JAM',
                    'status' => $status,
                ];
            });

        return response()->json($bookings);
    }

    public function book(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'court_id' => 'required|exists:courts,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'team_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string',
            'payment_method' => 'nullable|in:transfer_bank,e_wallet,qris,cash,dp',
        ]);

        // Limit pending bookings
        $pending = $request->user()->bookings()->where('tenant_id', $tenant->id)->where('status', 'pending')->count();
        if ($pending >= 5) {
            return back()->withErrors(['start_time' => 'Maksimal 5 booking pending.']);
        }

        // Check overlap
        $overlap = Booking::where('tenant_id', $tenant->id)
            ->where('court_id', $validated['court_id'])
            ->where('date', $validated['date'])
            ->whereIn('status', ['pending', 'approved'])
            ->where(fn($q) => $q->where('start_time', '<', $validated['end_time'])->where('end_time', '>', $validated['start_time']))
            ->exists();

        if ($overlap) {
            return back()->withErrors(['start_time' => 'Slot waktu ini sudah dipesan.']);
        }

        $paymentMethod = $validated['payment_method'] ?? 'transfer_bank';
        unset($validated['payment_method']);

        $booking = Booking::create([...$validated, 'tenant_id' => $tenant->id, 'user_id' => $request->user()->id]);

        $court = Court::find($validated['court_id']);
        $booking->payment()->create(['method' => $paymentMethod, 'amount' => $court->price_per_hour, 'status' => 'unpaid']);

        return back();
    }

    public function markPaid(Request $request, Tenant $tenant, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) abort(403);
        $booking->payment?->update(['status' => 'paid']);
        return back();
    }

    public function cancelBooking(Tenant $tenant, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) abort(403);
        if ($booking->status !== 'pending') return back()->withErrors(['error' => 'Hanya booking pending yang bisa dibatalkan.']);

        // Hanya bisa batalkan dalam 5 menit setelah booking dibuat
        if (now()->diffInMinutes($booking->created_at) > 5) {
            return back()->withErrors(['error' => 'Pembatalan hanya bisa dilakukan dalam 5 menit setelah booking.']);
        }

        $booking->status = 'cancelled';
        $booking->save();
        if ($booking->payment) {
            $booking->payment->update(['status' => 'refunded']);
        }

        return back();
    }

    public function reschedule(Request $request, Tenant $tenant, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) abort(403);
        if (!$tenant->allow_reschedule) return back()->withErrors(['date' => 'Venue ini tidak mengizinkan reschedule.']);
        if ($booking->status !== 'approved') return back()->withErrors(['date' => 'Hanya booking yang disetujui bisa direschedule.']);
        if ($booking->date->isPast()) return back()->withErrors(['date' => 'Tidak bisa reschedule booking yang sudah lewat.']);

        // Minimal 5 jam sebelum waktu bermain
        $playTime = $booking->date->copy()->setTimeFromTimeString($booking->start_time);
        if (now()->diffInHours($playTime, false) < 5) {
            return back()->withErrors(['date' => 'Reschedule hanya bisa dilakukan minimal 5 jam sebelum waktu bermain.']);
        }

        // Hanya 1x reschedule
        if ($booking->rescheduled) {
            return back()->withErrors(['date' => 'Booking ini sudah pernah di-reschedule. Maksimal 1x reschedule.']);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
        ]);

        $overlap = Booking::where('tenant_id', $tenant->id)
            ->where('court_id', $booking->court_id)
            ->where('date', $validated['date'])
            ->where('id', '!=', $booking->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(fn($q) => $q->where('start_time', '<', $validated['end_time'])->where('end_time', '>', $validated['start_time']))
            ->exists();

        if ($overlap) return back()->withErrors(['date' => 'Slot waktu ini sudah dipesan.']);

        $booking->update([...$validated, 'rescheduled' => true]);
        return back();
    }

    public function review(Request $request, Tenant $tenant, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) abort(403);
        if ($booking->status !== 'completed') return back()->withErrors(['rating' => 'Hanya booking selesai yang bisa direview.']);

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        Review::updateOrCreate(
            ['booking_id' => $booking->id],
            [...$validated, 'tenant_id' => $tenant->id, 'user_id' => auth()->id()]
        );

        return back();
    }
}
