<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tenants (venue owners)
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('plan', ['free', 'starter', 'pro', 'enterprise'])->default('free');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pivot: which users belong to which tenant (and their role in that tenant)
        Schema::create('tenant_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'admin', 'staff'])->default('staff');
            $table->timestamps();
            $table->unique(['tenant_id', 'user_id']);
        });

        // Courts (tenant-scoped)
        Schema::create('courts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type', 50);
            $table->string('location')->nullable();
            $table->integer('capacity')->default(10);
            $table->decimal('price_per_hour', 10, 2);
            $table->string('photo')->nullable();
            $table->time('open_time')->default('07:00');
            $table->time('close_time')->default('23:00');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Bookings (tenant-scoped)
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('court_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('team_name');
            $table->string('phone');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('method', 50);
            $table->decimal('amount', 10, 2);
            $table->string('proof')->nullable();
            $table->enum('status', ['unpaid', 'paid', 'verified', 'refunded'])->default('unpaid');
            $table->timestamps();
        });

        // Tarif rules (tenant-scoped)
        Schema::create('tarif_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('slot');
            $table->decimal('weekday_price', 10, 2);
            $table->decimal('weekend_price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarif_rules');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('courts');
        Schema::dropIfExists('tenant_user');
        Schema::dropIfExists('tenants');
    }
};
