<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = ['name', 'slug', 'logo', 'address', 'city', 'phone', 'email', 'plan', 'is_active', 'is_verified', 'description', 'rules', 'facilities', 'photos', 'refund_policy', 'reschedule_policy', 'allow_reschedule'];

    protected function casts(): array
    {
        return ['photos' => 'array', 'is_active' => 'boolean'];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tenant_user')->withPivot('role')->withTimestamps();
    }

    public function courts(): HasMany
    {
        return $this->hasMany(Court::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function tarifRules(): HasMany
    {
        return $this->hasMany(TarifRule::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function owner(): ?User
    {
        return $this->users()->wherePivot('role', 'owner')->first();
    }
}
