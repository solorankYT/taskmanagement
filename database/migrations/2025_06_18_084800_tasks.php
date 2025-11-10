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
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('board_id')->nullable()->constrained()->onDelete('cascade');
        $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
        $table->string('title');
        $table->text('description')->nullable();
        $table->enum('status', ['incomplete', 'completed'])->default('incomplete');
        $table->unsignedTinyInteger('priority')->default(0);
        $table->date('due_date')->nullable();
        $table->unsignedInteger('position')->default(0);
        $table->unsignedInteger('estimated_pomodoros')->default(0);
        $table->timestamp('completed_at')->nullable();
        $table->timestamps();
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
