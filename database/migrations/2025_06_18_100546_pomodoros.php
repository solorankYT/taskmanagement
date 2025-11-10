<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up(): void
{
        Schema::create('pomodoros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();

            $table->unsignedInteger('duration_minutes')->default(25);
            $table->unsignedInteger('time_spent_seconds')->default(0);

            $table->boolean('is_break')->default(false);
            $table->enum('type', ['focus', 'short_break', 'long_break'])->default('focus');
            $table->enum('status', ['in_progress', 'completed', 'cancelled'])->default('in_progress');

            $table->timestamps();

            $table->index(['user_id', 'task_id']);
        });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
