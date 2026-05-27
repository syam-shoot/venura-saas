<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TarifRule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifController extends Controller
{
    public function index(Request $request, Tenant $tenant)
    {
        $types = $tenant->courts()->distinct()->pluck('type')->filter()->values();
        if ($types->isEmpty()) $types = collect(['Futsal']);

        $type = $request->query('type', $types->first());
        $rules = $tenant->tarifRules()->where('type', $type)->orderBy('slot')->get();

        if ($rules->isEmpty()) {
            $this->seedDefaults($tenant, $type);
            $rules = $tenant->tarifRules()->where('type', $type)->orderBy('slot')->get();
        } else {
            // Check if new court hours need additional slots
            $this->fillMissingSlots($tenant, $type, $rules);
            $rules = $tenant->tarifRules()->where('type', $type)->orderBy('slot')->get();
        }

        return Inertia::render('Tenant/Tarif', [
            'tenant' => $tenant,
            'rules' => $rules,
            'selectedType' => $type,
            'types' => $types,
        ]);
    }

    private function fillMissingSlots(Tenant $tenant, string $type, $existingRules): void
    {
        $courts = $tenant->courts()->where('type', $type)->get();
        if ($courts->isEmpty()) return;

        $openH = $courts->min(fn($c) => (int) substr($c->open_time, 0, 2));
        $rawCloseH = $courts->max(fn($c) => (int) substr($c->close_time, 0, 2));
        $closeH = $rawCloseH <= $openH ? 24 + $rawCloseH : $rawCloseH;

        $existingSlots = $existingRules->pluck('slot')->toArray();

        for ($h = $openH; $h < $closeH; $h++) {
            $displayH = $h >= 24 ? $h - 24 : $h;
            $nextH = ($h + 1) >= 24 ? ($h + 1) - 24 : $h + 1;
            $slot = sprintf('%02d:00 - %02d:00', $displayH, $nextH);

            if (!in_array($slot, $existingSlots)) {
                $wd = ($displayH >= 18 || $displayH < 6) ? 350000 : ($displayH < 12 ? 200000 : 250000);
                $we = ($displayH >= 18 || $displayH < 6) ? 400000 : ($displayH < 12 ? 250000 : 300000);
                TarifRule::create(['tenant_id' => $tenant->id, 'type' => $type, 'slot' => $slot, 'weekday_price' => $wd, 'weekend_price' => $we]);
            }
        }
    }

    public function store(Request $request, Tenant $tenant)
    {
        $request->validate([
            'type' => 'required|string|max:50',
            'rules' => 'present|array',
            'rules.*.slot' => 'required|string',
            'rules.*.weekday_price' => 'required|numeric|min:0',
            'rules.*.weekend_price' => 'required|numeric|min:0',
        ]);

        // Delete existing rules for this type and replace
        $tenant->tarifRules()->where('type', $request->type)->delete();

        foreach ($request->rules ?? [] as $rule) {
            TarifRule::create([
                'tenant_id' => $tenant->id,
                'type' => $request->type,
                'slot' => $rule['slot'],
                'weekday_price' => $rule['weekday_price'],
                'weekend_price' => $rule['weekend_price'],
            ]);
        }

        return back();
    }

    private function seedDefaults(Tenant $tenant, string $type): void
    {
        // Get earliest open and latest close from courts of this type
        $courts = $tenant->courts()->where('type', $type)->get();
        $openH = 6;
        $closeH = 23;
        if ($courts->isNotEmpty()) {
            $openH = $courts->min(fn($c) => (int) substr($c->open_time, 0, 2));
            $rawCloseH = $courts->max(fn($c) => (int) substr($c->close_time, 0, 2));
            // Handle overnight (e.g. close at 03:00 means next day)
            $closeH = $rawCloseH <= $openH ? 24 + $rawCloseH : $rawCloseH;
        }

        for ($h = $openH; $h < $closeH; $h++) {
            $displayH = $h >= 24 ? $h - 24 : $h;
            $nextH = ($h + 1) >= 24 ? ($h + 1) - 24 : $h + 1;
            $slot = sprintf('%02d:00 - %02d:00', $displayH, $nextH);
            $wd = ($displayH >= 18 || $displayH < 6) ? 350000 : ($displayH < 12 ? 200000 : 250000);
            $we = ($displayH >= 18 || $displayH < 6) ? 400000 : ($displayH < 12 ? 250000 : 300000);
            TarifRule::create(['tenant_id' => $tenant->id, 'type' => $type, 'slot' => $slot, 'weekday_price' => $wd, 'weekend_price' => $we]);
        }
    }
}
