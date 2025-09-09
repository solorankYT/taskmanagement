import React from 'react';
import { Task } from '@/types/models';
import { Card } from '../ui/card';


export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (

    <div className="flex flex-wrap gap-4">
       <p className='text-white'>test</p>
      {tasks.map(task => (
        <Card key={task.id} className="w-60 p-4">
          <p className="font-semibold">{task.title}</p>
          <p className="text-sm text-muted-foreground capitalize">{task.status}</p>
        </Card>
      ))}
    </div>
  );
}
