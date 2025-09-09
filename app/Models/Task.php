<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Task extends Model
{
    protected $fillable = [
        'user_id', 'project_id', 'title', 'description',
        'status', 'priority', 'due_date', 'estimated_pomodoros', 'completed_at',
        'position'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
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
