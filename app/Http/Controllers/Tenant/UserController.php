<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Tenant $tenant)
    {
        // Get users who have booked at this tenant
        $userIds = $tenant->bookings()->distinct()->pluck('user_id');
        $users = User::whereIn('id', $userIds)->withCount(['bookings' => fn($q) => $q->where('tenant_id', $tenant->id)])->get();

        return Inertia::render('Tenant/Users', [
            'tenant' => $tenant,
            'users' => $users,
        ]);
    }

    public function toggleActive(Tenant $tenant, User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();
        return back();
    }
}
