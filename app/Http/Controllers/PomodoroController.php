<?php

namespace App\Http\Controllers;

use App\Models\Pomodoro;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PomodoroController extends Controller
{
    public function index()
    {
        $pomodoros = Auth::user()->pomodoros()->with('task')->latest()->get();
        return view('pomodoros.index', compact('pomodoros'));
    }

    public function create()
    {
        $tasks = Auth::user()->tasks()->where('status', '!=', 'completed')->get();
        return view('pomodoros.create', compact('tasks'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1|max:60',
            'is_break' => 'required|boolean',
        ]);

        $validated['user_id'] = Auth::id();

        Pomodoro::create($validated);

        return redirect()->route('pomodoros.index')->with('success', 'Pomodoro session recorded!');
    }

    public function show(Pomodoro $pomodoro)
    {
        $this->authorize('view', $pomodoro);
        return view('pomodoros.show', compact('pomodoro'));
    }

    public function edit(Pomodoro $pomodoro)
    {
        $this->authorize('update', $pomodoro);
        $tasks = Auth::user()->tasks()->get();
        return view('pomodoros.edit', compact('pomodoro', 'tasks'));
    }

    public function update(Request $request, Pomodoro $pomodoro)
    {
        $this->authorize('update', $pomodoro);

        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'duration_minutes' => 'required|integer|min:1|max:60',
            'is_break' => 'required|boolean',
        ]);

        $pomodoro->update($validated);

        return redirect()->route('pomodoros.index')->with('success', 'Pomodoro session updated!');
    }

    public function destroy(Pomodoro $pomodoro)
    {
        $this->authorize('delete', $pomodoro);
        $pomodoro->delete();

        return redirect()->route('pomodoros.index')->with('success', 'Pomodoro session deleted!');
    }
}
