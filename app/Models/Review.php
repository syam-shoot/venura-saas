<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = ['tenant_id', 'user_id', 'booking_id', 'rating', 'comment'];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function booking(): BelongsTo { return $this->belongsTo(Booking::class); }
    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
}
