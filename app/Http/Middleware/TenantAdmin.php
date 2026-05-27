<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class TenantAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = app('currentTenant');
        $user = $request->user();

        if (!$user || !$user->isTenantAdmin($tenant)) {
            abort(403);
        }

        // Check if tenant is verified by super admin
        if (!$tenant->is_verified) {
            return Inertia::render('Tenant/PendingVerification', ['tenant' => $tenant])->toResponse($request);
        }

        return $next($request);
    }
}
