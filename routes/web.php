<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PomodoroController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::put('/tasks/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::put('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::put('/projects/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');
    Route::resource('projects', ProjectController::class);
    Route::resource('tasks', TaskController::class);
});

Route::middleware(['auth'])->group(function () {
    Route::resource('pomodoros', PomodoroController::class);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
