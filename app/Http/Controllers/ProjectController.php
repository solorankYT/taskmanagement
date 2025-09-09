<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $projects = Auth::user()
            ->projects()
            ->with(['tasks' => function ($q) {
                $q->orderBy('position');
            }])
            ->orderBy('position')
            ->get();

        return Inertia::render('Tasks/Index', [
            'projects' => $projects
        ]);
    }


    public function create()
    {
        return view('projects.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $lastPosition = Auth::user()->projects()->max('position');

        $validated['position'] = $lastPosition + 1;

        Auth::user()->projects()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Project created!');
    }



    public function edit(Project $project)
    {
        $this->authorize('update', $project);

        return view('projects.edit', compact('project'));
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')->with('success', 'Project updated!');
    }

    public function destroy(Project $project)
{
    $project->delete();

    return back()->with('success', 'Project deleted!');
}
 
    public function reorder(Request $request)
    {
        $projects = $request->input('projects');

        foreach ($projects as $index => $projectId) {
            Project::where('id', $projectId)
                ->where('user_id', Auth::id())
                ->update(['position' => $index]);
        }
    }
}
