<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TarifRule extends Model
{
    protected $fillable = ['tenant_id', 'type', 'slot', 'weekday_price', 'weekend_price'];
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
