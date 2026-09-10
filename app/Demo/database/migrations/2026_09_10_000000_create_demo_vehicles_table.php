<?php

declare(strict_types=1);

use App\Demo\VehicleFixtures;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_vehicles', function (Blueprint $table): void {
            $table->id();
            $table->string('stock_number')->unique();
            $table->string('vin', 17)->unique();
            $table->string('license_plate')->nullable();
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->string('color');
            $table->string('body_type');
            $table->string('fuel_type');
            $table->unsignedInteger('odometer');
            $table->string('status')->index();
            $table->string('assigned_driver')->nullable();
            $table->boolean('bookable')->default(true);
            $table->date('purchased_on');
            $table->date('last_serviced_on')->nullable();
            // Cents. A demo that models money as a float teaches a bug.
            $table->unsignedInteger('purchase_price');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // The demo seeds itself from its own migration, deliberately. It means a
        // fresh clone is populated by `php artisan migrate` with no seeder step,
        // RefreshDatabase gives every test the same rows, and removing the demo
        // never has to touch database/seeders/DatabaseSeeder.php.
        DB::table('demo_vehicles')->insert(VehicleFixtures::rows());
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_vehicles');
    }
};
