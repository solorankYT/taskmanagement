<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Task extends Model
{
    protected $fillable = [
        'user_id',
        'board_id',
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'estimated_pomodoros',
        'completed_at',
        'position'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'due_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function board()
    {
        return $this->belongsTo(Board::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function pomodoros()
    {
        return $this->hasMany(Pomodoro::class);
    }
}
