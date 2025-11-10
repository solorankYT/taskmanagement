<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $boards = auth()->user()
        ->boards()
        ->get();
        return Inertia::render('Boards/Index',[
            'boards' => $boards,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request, OpenAIService $openAI)
{
    $validated = $request->validate([
        'title' => 'required|string|max:64',
        'description' => 'nullable|string',
        'created_by_ai' => 'boolean',
        'metadata' => 'nullable|array', // contains AI instruction: ['instruction' => '...']
    ]);

    $validated['user_id'] = Auth::id();

    // 1️⃣ Create the board first
    $board = Board::create([
        'user_id' => $validated['user_id'],
        'title' => $validated['title'],
        'description' => $validated['description'],
        'created_by_ai' => $validated['created_by_ai'] ?? false,
        'metadata' => $validated['metadata'] ?? [],
    ]);

    // 2️⃣ If AI is requested and instruction exists
    if ($board->created_by_ai && !empty($board->metadata['instruction'])) {
        $instruction = $board->metadata['instruction'];

        // Call AI to generate projects and tasks
        $aiProjects = $openAI->generateProjectsAndTasks($instruction, 3, 5);

        $generatedProjects = [];

        foreach ($aiProjects as $projData) {
            $project = $board->projects()->create([
                'user_id' => Auth::id(),
                'name' => $projData['project'] ?? 'Untitled Project',
                'description' => $projData['description'] ?? null,
            ]);

            if (!empty($projData['tasks'])) {
                foreach ($projData['tasks'] as $task) {
                    $project->tasks()->create([
                        'user_id' => Auth::id(),
                        'title' => $task['title'] ?? 'Untitled Task',
                        'description' => $task['description'] ?? null,
                    ]);
                }
            }

            $generatedProjects[] = $project->load('tasks');
        }

        // 3️⃣ Store generated projects in metadata
       $metadata = $board->metadata; // get the array
        $metadata['generated_projects'] = collect($generatedProjects)->map(function($proj) {
            return [
                'id' => $proj->id,
                'name' => $proj->name,
                'description' => $proj->description,
                'tasks' => $proj->tasks->map(fn($t) => [
                    'id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                ])->toArray(),
            ];
        })->toArray();

        $board->metadata = $metadata; // assign back
        $board->save();

        \Log::info('AI projects generated', ['instruction' => $instruction, 'projects' => $aiProjects]);

    }

    // 4️⃣ Return the board fully loaded
    return response()->json(['board' => $board->load('projects.tasks')]);
}


    /**
     * Display the specified resource.
     */
   public function show(Board $board)
{
    $board->load([
        'projects' => function ($q) {
            $q->with(['tasks' => function ($q2) {
                $q2->orderBy('position');
            }])->orderBy('position');
        }
    ]);

    return Inertia::render('Boards/Show', [
        'board' => $board,
        'projects' => $board->projects,
    ]);
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $board->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Board $board)
    {
        $board->delete();
        return redirect()->back()->with('success', 'Board deleted successfully.');
    }
}
