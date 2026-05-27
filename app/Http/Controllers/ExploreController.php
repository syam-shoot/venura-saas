<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index(Request $request)
    {
        // Mitra venue tidak perlu explore
        if ($request->user()->role === 'tenant_admin') {
            $tenant = $request->user()->tenants()->first();
            if ($tenant) return redirect("/{$tenant->slug}/admin");
            return redirect('/onboarding');
        }

        $query = Tenant::where('is_active', true)->withCount('courts');

        if ($city = $request->query('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $venues = $query->latest()->get();
        $cities = Tenant::where('is_active', true)->whereNotNull('city')->distinct()->pluck('city');

        return Inertia::render('Explore', [
            'venues' => $venues,
            'cities' => $cities,
            'filters' => ['city' => $city, 'search' => $search],
        ]);
    }
}
