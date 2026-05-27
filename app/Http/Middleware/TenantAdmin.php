<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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

        return $next($request);
    }
}
