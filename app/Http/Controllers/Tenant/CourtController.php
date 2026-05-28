<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourtController extends Controller
{
    public function index(Tenant $tenant)
    {
        return Inertia::render('Tenant/Courts', [
            'tenant' => $tenant,
            'courts' => $tenant->courts()->latest()->get(),
        ]);
    }

    public function store(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'location' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'price_per_hour' => 'required|numeric|min:0',
            'open_time' => 'required',
            'close_time' => 'required',
            'weekend_open_time' => 'nullable',
            'weekend_close_time' => 'nullable',
        ]);

        // Set null if empty
        if (empty($validated['weekend_open_time'])) $validated['weekend_open_time'] = null;
        if (empty($validated['weekend_close_time'])) $validated['weekend_close_time'] = null;

        $tenant->courts()->create($validated);
        return back();
    }

    public function update(Request $request, Tenant $tenant, Court $court)
    {
        if ($court->tenant_id !== $tenant->id) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'price_per_hour' => 'required|numeric|min:0',
            'open_time' => 'required',
            'close_time' => 'required',
            'is_active' => 'boolean',
        ]);

        $court->update($validated);
        return back();
    }

    public function destroy(Tenant $tenant, Court $court)
    {
        if ($court->tenant_id !== $tenant->id) abort(403);

        $court->delete();
        return back();
    }
}
