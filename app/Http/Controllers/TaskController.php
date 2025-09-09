<?php
namespace App\Http\Controllers;


use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
{
    $tasks = Auth::user()
        ->tasks()
        ->with('project')
        ->orderBy('position')
        ->latest()
        ->get();
    return Inertia::render('Tasks/Index', [
        'tasks' => $tasks
    ]);
}

    public function create()
    {
        $projects = Auth::user()->projects()->get();
        return view('tasks.create', compact('projects'));
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'status' => 'in:pending,in_progress,completed',
        'priority' => 'integer|between:0,2',
        'due_date' => 'nullable|date',
        'estimated_pomodoros' => 'nullable|integer|min:0',
        'project_id' => 'nullable|exists:projects,id',
    ]);

    $lastPosition = Task::where('project_id', $validated['project_id'])
        ->max('position') ?? 0;

    $validated['position'] = $lastPosition + 1;
    $validated['user_id'] = Auth::id();

    Task::create($validated);

    return redirect()->route('dashboard')->with('success', 'Task created!');
}


    public function show(Task $task)
    {
        return view('tasks.show', compact('task'));
    }

    public function edit(Task $task)
    {
        $projects = Auth::user()->projects()->get();
        return view('tasks.edit', compact('task', 'projects'));
    }

    public function update(Request $request, Task $task)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'integer|between:0,2',
            'due_date' => 'nullable|date',
            'estimated_pomodoros' => 'nullable|integer|min:0',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $task->update($validated);
    }

    public function destroy(Task $task)
    {
        $task->delete();
    }

    public function reorder(Request $request)
    {
        $taskIds = $request->tasks;
        foreach ($taskIds as $index => $taskId) {
            Task::where('id', $taskId)->update(['position' => $index]);
        }
    }

    public function move(Request $request)
    {
        $task = Task::findOrFail($request->task_id);

        $task->project_id = $request->to_project;
        $task->update();

        foreach ($request->tasks as $index => $taskId) {
            Task::where('id', $taskId)->update([
                'position' => $index,
                'project_id' => $request->to_project, 
            ]);
        }
    }
}
