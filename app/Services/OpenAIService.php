<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    public function generateProjectsAndTasks(string $instruction, int $projectCount = 3, int $tasksPerProject = 5): array
    {
        $prompt = <<<PROMPT
Create $projectCount projects and $tasksPerProject tasks per project for a productivity Kanban board based on this instruction: "$instruction". 
Return ONLY valid JSON in this format:
[
  {
    "project": "Project Name",
    "description": "optional",
    "tasks": [
      { "title": "Task title", "description": "optional" }
    ]
  }
]
Do not include any explanations or text outside the JSON array.
PROMPT;

        try {
            $response = OpenAI::chat()->create([
                'model' => config('openai.model'),
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a productivity assistant that creates structured projects and tasks for Kanban boards.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
            ]);

            $text = $response->choices[0]->message->content;

            // Log raw AI response
            Log::info('AI raw response: ' . $text);

            // Attempt to extract JSON array from any surrounding text
            if (preg_match('/\[[\s\S]*\]/', $text, $matches)) {
                $text = $matches[0];
            }

            // Decode JSON safely
            try {
                $projects = json_decode($text, true, 512, JSON_THROW_ON_ERROR);
                return is_array($projects) ? $projects : [];
            } catch (\JsonException $e) {
                Log::error('Invalid JSON from AI: ' . $text);
                return [];
            }

        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return [];
        }
    }
}
