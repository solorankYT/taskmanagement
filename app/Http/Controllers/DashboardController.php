<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

class DashboardController extends Controller
{
 public function index()
{
    $projects = auth()->user()
        ->projects()
        ->with('tasks')
        ->get();

    return Inertia::render('Dashboard', [
        'projects' => $projects,
    ]);
}
}
