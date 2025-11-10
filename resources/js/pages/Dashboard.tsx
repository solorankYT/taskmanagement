import { useState } from 'react';
import CalendarTask from '@/components/Calendar';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {ProjectWithTasks} from '@/types/models';
import TaskIndex from './Tasks/Index';
import TaskDate from './Tasks/TaskDate';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface DashboardProps {
  projects: ProjectWithTasks[];
}

export default function Dashboard({ projects }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
  
        {/* <div className="hidden md:block flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <div className="flex h-full min-h-[300px] bg-white dark:bg-black overflow-hidden ">
            <TaskIndex projects={projects} />
          </div>
        </div> */}


        
        <div className="hidden md:grid auto-rows-min gap-4 xl:grid-cols-2 md:grid-cols-1">
          {/* <Card className="flex items-center justify-center p-0 overflow-hidden aspect-video">
            <PomodoroTimer />
          </Card> */}

          <Card className="flex items-center justify-center p-0 overflow-hidden aspect-video">
            <CalendarTask onDateSelect={setSelectedDate}/>
          </Card>

          <Card className="flex items-center justify-center p-0 overflow-hidden aspect-video">
           <TaskDate projects={projects} selectedDate={selectedDate} />
          </Card>
        </div>
        
        <div className="block md:hidden flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <div className="flex h-full min-h-[300px] bg-white dark:bg-black overflow-hidden">
            <TaskIndex projects={projects} />
          </div>
        </div>

        
      </div>
    </AppLayout>
  );
}

