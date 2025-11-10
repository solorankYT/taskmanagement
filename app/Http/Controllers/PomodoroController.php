<?php

namespace App\Http\Controllers;

use App\Models\Pomodoro;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PomodoroController extends Controller
{
    public function index()
    {
        return inertia('Pomodoro/Index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'duration_minutes' => 'required|integer|min:1',
            'is_break' => 'boolean',
        ]);

        $pomodoro = Pomodoro::create([
            'user_id' => auth()->id(),
            'task_id' => $request->task_id,
            'start_time' => Carbon::now(),
            'end_time' => Carbon::now()->addMinutes($request->duration_minutes),
            'duration_minutes' => $request->duration_minutes,
            'is_break' => $request->is_break ?? false,
        ]);

        return response()->json($pomodoro);
    }

    public function update(Request $request, Pomodoro $pomodoro)
    {
        $request->validate([
            'time_spent_seconds' => 'nullable|integer',
            'status' => 'nullable|string|in:completed,cancelled',
        ]);

        $pomodoro->update([
            'end_time' => now(),
            'time_spent_seconds' => $request->time_spent_seconds,
            'status' => $request->status ?? 'completed',
        ]);

        return response()->json(['success' => true]);
    }
}
