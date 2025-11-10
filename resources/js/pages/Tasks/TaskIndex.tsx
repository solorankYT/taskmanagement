import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import TaskIndex from "./Index";
import { Boards, ProjectWithTasks } from "@/types/models";

interface TasksPageProps {
  board: Boards;
  projects: ProjectWithTasks[];
}

export default function TasksPage({board, projects }: TasksPageProps) {
  return (
    <AppLayout breadcrumbs={[{ title: "Tasks", href: "/tasks" }]}>
      <Head title="Tasks" />
      <div className="p-4">
        <TaskIndex boardId={board.id} projects={projects} />

      </div>
    </AppLayout>
  );
}
