<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin (platform owner)
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@venura.app',
            'password' => Hash::make('password'),
            'phone' => '081200000000',
            'email_verified_at' => now(),
        ]);
        $superAdmin->role = 'super_admin';
        $superAdmin->save();

        // Tenant owner 1
        $owner1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@greenfutsal.com',
            'password' => Hash::make('password'),
            'phone' => '085211112222',
            'email_verified_at' => now(),
        ]);
        $owner1->role = 'tenant_admin';
        $owner1->save();

        $tenant1 = Tenant::create([
            'name' => 'Green Futsal Arena',
            'slug' => 'green-futsal',
            'address' => 'Jl. Sudirman No. 10, Makassar',
            'phone' => '085211112222',
            'email' => 'budi@greenfutsal.com',
            'plan' => 'starter',
        ]);
        $tenant1->users()->attach($owner1->id, ['role' => 'owner']);

        // Add courts to tenant 1
        $tenant1->courts()->createMany([
            ['name' => 'Lapangan A', 'type' => 'Futsal', 'location' => 'Lantai 1', 'capacity' => 14, 'price_per_hour' => 350000, 'open_time' => '07:00', 'close_time' => '23:00'],
            ['name' => 'Lapangan B', 'type' => 'Futsal', 'location' => 'Lantai 2', 'capacity' => 14, 'price_per_hour' => 400000, 'open_time' => '07:00', 'close_time' => '23:00'],
        ]);

        // Tenant owner 2
        $owner2 = User::create([
            'name' => 'Rina Wati',
            'email' => 'rina@rajawalibadminton.com',
            'password' => Hash::make('password'),
            'phone' => '087833334444',
            'email_verified_at' => now(),
        ]);
        $owner2->role = 'tenant_admin';
        $owner2->save();

        $tenant2 = Tenant::create([
            'name' => 'Rajawali Badminton Hall',
            'slug' => 'rajawali-badminton',
            'address' => 'Jl. Gatot Subroto No. 5, Jakarta',
            'phone' => '087833334444',
            'email' => 'rina@rajawalibadminton.com',
            'plan' => 'free',
        ]);
        $tenant2->users()->attach($owner2->id, ['role' => 'owner']);

        $tenant2->courts()->create([
            'name' => 'Court 1', 'type' => 'Bulu Tangkis', 'location' => 'Hall A', 'capacity' => 4, 'price_per_hour' => 80000, 'open_time' => '06:00', 'close_time' => '22:00',
        ]);

        // Customer
        $customer = User::create([
            'name' => 'Customer Demo',
            'email' => 'customer@demo.com',
            'password' => Hash::make('password'),
            'phone' => '089900001111',
            'email_verified_at' => now(),
        ]);

        // Demo bookings for today (so FIDS has data)
        $booking1 = new \App\Models\Booking([
            'tenant_id' => $tenant1->id,
            'user_id' => $customer->id,
            'court_id' => $tenant1->courts()->first()->id,
            'date' => now()->toDateString(),
            'start_time' => '19:00',
            'end_time' => '21:00',
            'team_name' => 'Garuda FC',
            'phone' => '089900001111',
            'notes' => 'Latihan rutin',
        ]);
        $booking1->status = 'approved';
        $booking1->save();
        \App\Models\Payment::create(['booking_id' => $booking1->id, 'method' => 'transfer_bank', 'amount' => 1500000, 'status' => 'verified']);

        $booking2 = new \App\Models\Booking([
            'tenant_id' => $tenant1->id,
            'user_id' => $customer->id,
            'court_id' => $tenant1->courts()->skip(1)->first()->id,
            'date' => now()->toDateString(),
            'start_time' => '17:00',
            'end_time' => '18:00',
            'team_name' => 'Elang Muda',
            'phone' => '089900001111',
        ]);
        $booking2->status = 'pending';
        $booking2->save();
        \App\Models\Payment::create(['booking_id' => $booking2->id, 'method' => 'qris', 'amount' => 400000, 'status' => 'unpaid']);
    }
}
