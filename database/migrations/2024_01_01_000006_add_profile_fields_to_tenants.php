<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->text('description')->nullable()->after('city');
            $table->text('rules')->nullable()->after('description');
            $table->text('facilities')->nullable()->after('rules');
            $table->json('photos')->nullable()->after('facilities');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['description', 'rules', 'facilities', 'photos']);
        });
    }
};
