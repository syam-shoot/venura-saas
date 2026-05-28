<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        Log::info('User logged in', ['user_id' => $request->user()->id, 'email' => $request->user()->email, 'ip' => $request->ip()]);

        // Force redirect based on role, ignore intended URL
        $user = $request->user();
        if ($user->isSuperAdmin()) {
            return redirect('/super-admin');
        }

        $tenant = $user->tenants()->first();
        if ($tenant) {
            return redirect("/{$tenant->slug}/admin");
        }

        if ($user->role === 'customer') {
            return redirect('/explore');
        }

        return redirect('/onboarding');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Log::info('User logged out', ['user_id' => $request->user()?->id, 'ip' => $request->ip()]);

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
