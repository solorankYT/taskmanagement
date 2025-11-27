<?php

namespace App\Providers;

use Inertia\Inertia;
use App\Models\Board;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share boards with all Inertia pages
        Inertia::share([
            'boards' => function () {
                return auth()->user()->boards;
            },
        ]);
    }
}
