<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->time('weekend_open_time')->nullable()->after('close_time');
            $table->time('weekend_close_time')->nullable()->after('weekend_open_time');
        });
    }

    public function down(): void
    {
        Schema::table('courts', function (Blueprint $table) {
            $table->dropColumn(['weekend_open_time', 'weekend_close_time']);
        });
    }
};
