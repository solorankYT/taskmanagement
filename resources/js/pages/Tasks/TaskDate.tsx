import { Card, CardContent } from "@/components/ui/card";
import { ProjectWithTasks } from "@/types/models";
import { isToday, isBefore } from "date-fns";

interface Props {
  projects: ProjectWithTasks[];
  selectedDate: Date | undefined;
}

export default function TaskDate({ projects, selectedDate }: Props) {
  if (!selectedDate) return <p className="p-4">Select a date to see tasks</p>;

  const formattedSelected = selectedDate.toLocaleDateString("en-CA");

  const tasksForDate =
    projects.flatMap((p) =>
      (p.tasks || []).filter(
        (t) => t.due_date && t.due_date.startsWith(formattedSelected)
      )
    ) || [];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">
        Tasks for {selectedDate.toLocaleDateString()}
      </h2>
      {tasksForDate.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks due on this date.</p>
      ) : (
        <div className="list-disc list-inside text-sm text-gray-700">
          {tasksForDate.map((task) => {
            let dueLabel: string | null = null;

            if (task.due_date) {
              const dueDate = new Date(task.due_date);

              if (isToday(dueDate)) {
                dueLabel = "Today";
              } else if (isBefore(dueDate, new Date())) {
                dueLabel = "Overdue";
              } 
            }

            return (
              <Card className="p-2 mt-2" key={task.id}>
                <CardContent>
                  {task.title} –{" "}
                  <span>
                    {projects.find((p) => p.id === task.project_id)?.name ||
                      "No Project"}
                  </span>
                  – {task.status}
                  –{" "}
                  {task.priority === 0
                    ? "Low"
                    : task.priority === 1
                    ? "Medium"
                    : task.priority === 2
                    ? "High"
                    : "No Priority"}
                  {dueLabel ? ` – ${dueLabel}` : ""}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
