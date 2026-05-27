<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $slug = $request->route('tenant');

        if ($slug instanceof Tenant) {
            $tenant = $slug;
        } else {
            $tenant = Tenant::where('slug', $slug)->where('is_active', true)->first();
        }

        if (!$tenant) {
            abort(404, 'Venue tidak ditemukan.');
        }

        // Block public access to unverified venues (except for owner)
        if (!$tenant->is_verified) {
            $user = $request->user();
            if (!$user || !$user->isTenantAdmin($tenant)) {
                abort(404, 'Venue tidak ditemukan.');
            }
        }

        app()->instance('currentTenant', $tenant);

        // Replace route parameter with actual Tenant model for controller injection
        $request->route()->setParameter('tenant', $tenant);

        return $next($request);
    }
}
