<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    protected $fillable = ['tenant_id', 'user_id', 'court_id', 'date', 'start_time', 'end_time', 'team_name', 'phone', 'notes'];

    protected function casts(): array
    {
        return ['date' => 'date:Y-m-d'];
    }

    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function court(): BelongsTo { return $this->belongsTo(Court::class); }
    public function payment(): HasOne { return $this->hasOne(Payment::class); }
}
