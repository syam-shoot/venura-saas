<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'unverified_users' => User::whereNull('email_verified_at')->count(),
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

        $monthlyRevenue = DB::table('bookings')
            ->leftJoin('payments', 'bookings.id', '=', 'payments.booking_id')
            ->where('bookings.tenant_id', $tenant->id)
            ->whereIn('bookings.status', ['approved', 'completed'])
            ->where('bookings.date', '>=', now()->subMonths(6)->startOfMonth()->toDateString())
            ->select(DB::raw('DATE_FORMAT(bookings.date, "%Y-%m") as month'), DB::raw('COUNT(DISTINCT bookings.id) as count'), DB::raw('COALESCE(SUM(payments.amount), 0) as revenue'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('SuperAdmin/TenantDetail', [
            'tenant' => $tenant,
            'owner' => $owner,
            'stats' => [
                'courts' => $tenant->courts()->count(),
                'bookings' => $tenant->bookings()->count(),
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'popularCourts' => DB::table('bookings')
                ->join('courts', 'bookings.court_id', '=', 'courts.id')
                ->where('bookings.tenant_id', $tenant->id)
                ->select('courts.name', 'courts.type', DB::raw('COUNT(*) as total'))
                ->groupBy('courts.id', 'courts.name', 'courts.type')
                ->orderByDesc('total')
                ->limit(5)
                ->get(),
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

        // Also verify owner's email if not yet verified
        $owner = $tenant->users()->wherePivot('role', 'owner')->first();
        if ($owner) {
            if (!$owner->email_verified_at) {
                $owner->email_verified_at = now();
                $owner->save();
            }
            // Send notification email
            $owner->notify(new \App\Notifications\TenantVerifiedNotification($tenant));
        }

        return back();
    }

    public function users()
    {
        $users = User::with('tenants')->where('role', 'tenant_admin')->latest()->get()->map(fn ($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone,
            'role' => $u->role,
            'is_active' => $u->is_active,
            'email_verified_at' => $u->email_verified_at,
            'created_at' => $u->created_at,
            'tenant_name' => $u->tenants->first()?->name,
        ]);

        return Inertia::render('SuperAdmin/Users', ['users' => $users]);
    }

    public function toggleUser(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();
        return back();
    }

    public function deleteUser(User $user)
    {
        $ownedTenants = $user->tenants()->wherePivot('role', 'owner')->get();
        $user->tenants()->detach();
        foreach ($ownedTenants as $tenant) {
            $tenant->delete();
        }
        $user->delete();
        return back();
    }

    public function verifyUserEmail(User $user)
    {
        $user->email_verified_at = now();
        $user->save();
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
