<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'created_by_ai',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_by_ai' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
