export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'incomplete' | 'completed';
  priority: 0 | 1 | 2;
  due_date: string;
  estimated_pomodoros: number | null;
  completed_at: string | null;
  user_id: number;
  project_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Pomodoro {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_break: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskWithProject extends Task {
  project?: Project | null;
}

export interface ProjectWithTasks extends Project {
  tasks?: Task[];

}
