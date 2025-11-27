<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\PomodoroController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::prefix('auth')->group(function () {
    Route::get('google', [GoogleController::class, 'redirect'])->name('google.redirect');
    Route::get('google/callback', [GoogleController::class, 'callback'])->name('google.callback');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::put('/tasks/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::post('/boards/{board}/projects', [ProjectController::class, 'store'])
    ->name('projects.store');
    Route::put('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::put('/projects/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');
    Route::resource('projects', ProjectController::class);
    Route::resource('tasks', TaskController::class);
    
    Route::get('/pomodoro', [PomodoroController::class, 'index'])->name('pomodoro.index');
    Route::get('/taskindex', [ProjectController::class, 'taskindex'])->name('tasks.taskindex');
    Route::get('/boards',[BoardController::class, 'index'])->name('boards.index');
    Route::get('/boards/{board}', [BoardController::class, 'show'])->name('boards.show');
    Route::post('/boards', [BoardController:: class, 'store']) -> name('boards.store');
    Route::put('/boards/{board}',[BoardController::class, 'update'])-> name('boards.update');
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']) -> name('boards.destroy');


    //Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index']) -> name('analytics.index');

    Route::get('/test-openai', function () {
    try {
        $response = \OpenAI\Laravel\Facades\OpenAI::chat()->create([
            'model' => config('openai.model'),
            'messages' => [['role'=>'user','content'=>'Say hello']],
        ]);
        dd($response->choices[0]->message->content);
    } catch (\Exception $e) {
        dd($e->getMessage());
    }
});

});

Route::middleware('auth')->group(function () {
    Route::post('/api/pomodoros', [PomodoroController::class, 'store'])->name('api.pomodoro.store');
    Route::put('/api/pomodoros/{pomodoro}', [PomodoroController::class, 'update'])->name('api.pomodoro.update');
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
