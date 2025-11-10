<?php

namespace App\Http\Controllers;

use App\Models\Board;
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:64',
            'description' => 'nullable|string',
            'created_by_ai' =>'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        $board = Board::create($validated);

        
      return response()->json(['board' => $board]);
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
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Board $board)
    {
        //
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
