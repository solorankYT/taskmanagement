<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pomodoro extends Model
{
    protected $fillable = [
        'task_id', 'user_id', 'start_time', 'end_time', 'duration_minutes', 'is_break'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}

