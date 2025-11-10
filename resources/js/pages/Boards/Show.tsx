import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import type { ProjectWithTasks, BoardWithProjects } from "@/types/models";
import TaskIndex from "../Tasks/Index";

interface Props {
  board: BoardWithProjects;
  projects: ProjectWithTasks[];
}

export default function BoardShow({ board, projects }: Props) {
  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{board.title}</h1>
          <Link href="/boards">
            <Button variant="outline">Back to Boards</Button>
          </Link>
        </div>

        {/* Kanban board */}
       <TaskIndex boardId={board.id} projects={projects} />

      </div>
    </AppLayout>
  );
}
