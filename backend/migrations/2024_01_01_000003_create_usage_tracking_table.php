<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->integer('files_processed')->default(0);
            $table->string('month_year', 7); // Format: 2026-02
            $table->date('last_reset_date');
            $table->timestamps();
            
            $table->unique(['user_id', 'month_year']);
            $table->index('user_id');
            $table->index('month_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_tracking');
    }
};
