<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;

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
