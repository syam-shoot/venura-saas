<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    protected $fillable = ['tenant_id', 'name', 'type', 'location', 'capacity', 'price_per_hour', 'photo', 'open_time', 'close_time', 'weekend_open_time', 'weekend_close_time', 'is_active'];

    protected function casts(): array
    {
        return ['price_per_hour' => 'decimal:2', 'is_active' => 'boolean'];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
