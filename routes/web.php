<?php

use App\Http\Controllers\TenantOnboardingController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\CourtController;
use App\Http\Controllers\Tenant\BookingController;
use App\Http\Controllers\Tenant\TarifController;
use App\Http\Controllers\Tenant\UserController;
use App\Http\Controllers\Tenant\ProfileController as TenantProfileController;
use App\Http\Controllers\Tenant\PublicController;
use App\Http\Controllers\Tenant\ReportController;
use App\Http\Controllers\SuperAdmin\SuperDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page (marketing) - redirect logged-in customers to explore
Route::get('/', function () {
    $user = auth()->user();
    if ($user && $user->role === 'customer') return redirect('/explore');
    return Inertia::render('Landing');
})->name('home');

// Auth routes
require __DIR__.'/auth.php';

// Tenant onboarding (register venue)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/explore', [ExploreController::class, 'index'])->name('explore');
    Route::get('/onboarding', [TenantOnboardingController::class, 'create'])->name('onboarding');
    Route::post('/onboarding', [TenantOnboardingController::class, 'store'])->name('onboarding.store');
    Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [\App\Http\Controllers\Auth\PasswordController::class, 'update'])->name('password.update');
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isSuperAdmin()) return redirect('/super-admin');
        $tenant = $user->tenants()->first();
        if ($tenant) return redirect("/{$tenant->slug}/admin");
        // Customer tanpa venue → redirect ke landing (mereka booking via /{slug})
        if ($user->role === 'customer') return redirect('/');
        return redirect('/onboarding');
    })->name('dashboard');
});

// Super Admin (platform owner) — MUST be before {tenant} wildcard
Route::prefix('/super-admin')->middleware(['auth', 'super.admin'])->name('super.')->group(function () {
    Route::get('/', [SuperDashboardController::class, 'index'])->name('dashboard');
    Route::get('/tenants/{tenant}', [SuperDashboardController::class, 'showTenant'])->name('tenants.show');
    Route::patch('/tenants/{tenant}/toggle', [SuperDashboardController::class, 'toggleTenant'])->name('tenants.toggle');
    Route::patch('/tenants/{tenant}/verify', [SuperDashboardController::class, 'verifyTenant'])->name('tenants.verify');
    Route::post('/mitra', [SuperDashboardController::class, 'createMitra'])->name('mitra.store');
});

// Public venue page (anyone can view schedule, must login to book)
Route::prefix('/{tenant}')->middleware('tenant')->group(function () {
    Route::get('/', [PublicController::class, 'schedule'])->name('venue.schedule');
    Route::get('/monitor', [PublicController::class, 'monitor'])->name('venue.monitor');
    Route::get('/api/schedule', [PublicController::class, 'apiSchedule'])->middleware('throttle:60,1');

    // Booking (requires login)
    Route::middleware(['auth', 'verified', 'throttle:10,1'])->group(function () {
        Route::post('/book', [PublicController::class, 'book'])->name('venue.book');
        Route::patch('/book/{booking}/pay', [PublicController::class, 'markPaid'])->name('venue.pay');
        Route::patch('/book/{booking}/cancel', [PublicController::class, 'cancelBooking'])->name('venue.cancel');
        Route::patch('/book/{booking}/reschedule', [PublicController::class, 'reschedule'])->name('venue.reschedule');
        Route::post('/book/{booking}/review', [PublicController::class, 'review'])->name('venue.review');
    });

    // Tenant admin panel
    Route::prefix('/admin')->middleware(['auth', 'tenant.admin'])->name('tenant.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.status');
        Route::patch('/bookings/{booking}/payment', [BookingController::class, 'updatePayment'])->name('bookings.payment');
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
        Route::get('/courts', [CourtController::class, 'index'])->name('courts.index');
        Route::post('/courts', [CourtController::class, 'store'])->name('courts.store');
        Route::put('/courts/{court}', [CourtController::class, 'update'])->name('courts.update');
        Route::delete('/courts/{court}', [CourtController::class, 'destroy'])->name('courts.destroy');
        Route::get('/tarif', [TarifController::class, 'index'])->name('tarif.index');
        Route::post('/tarif', [TarifController::class, 'store'])->name('tarif.store');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/toggle', [UserController::class, 'toggleActive'])->name('users.toggle');
        Route::get('/profile', [TenantProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [TenantProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/photos', [TenantProfileController::class, 'uploadPhotos'])->name('profile.photos');
        Route::delete('/profile/photos', [TenantProfileController::class, 'deletePhoto'])->name('profile.photos.delete');
        Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    });
});
