import React, { useEffect, useState } from "react";
import { ProjectWithTasks } from "@/types/models";
import { Card } from "@/components/ui/card";
import { router } from "@inertiajs/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EditIcon, TrashIcon } from "lucide-react";
import TaskModal from "./TaskModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"


interface Props {
  projects: ProjectWithTasks[];
}

export default function TaskIndex({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState(
    [...initialProjects].sort((a, b) => a.position - b.position)
  );
  const [addingTaskFor, setAddingTaskFor] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: number; title: string; description: string, due_date: string } | null>(null);

const handleEditTask = (task: { id: number; title: string; description: string; due_date: string }) => {
  setSelectedTask(task);
  setTaskModalOpen(true);
};

const handleSaveTask = (taskId: number, newTitle: string, newDescription: string, newdueDate: string) => {
  router.put(route("tasks.update", taskId), { title: newTitle, description: newDescription, due_date: newdueDate}, {
    preserveScroll: true,
    onSuccess: () => {
      setProjects((prev) =>
        prev.map((proj) => ({
          ...proj,
          tasks: proj.tasks?.map((t) =>
            t.id === taskId ? { ...t, title: newTitle, description: newDescription, due_date: newdueDate } : t
          ),
        }))
      );
    },
  });
};

const handleDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  const { source, destination, type } = result;

  if (type === "PROJECT") {
    // Reorder projects
    const reordered = Array.from(projects);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setProjects(reordered);

    router.put(route("projects.reorder"), {
      projects: reordered.map((p) => p.id),
    });
  }

  if (type === "TASK") {
    const sourceProjIndex = projects.findIndex(
      (p) => `project-${p.id}-tasks` === source.droppableId
    );
    const destProjIndex = projects.findIndex(
      (p) => `project-${p.id}-tasks` === destination.droppableId
    );

    if (sourceProjIndex === -1 || destProjIndex === -1) return;

    const sourceTasks = Array.from(projects[sourceProjIndex].tasks || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceProjIndex === destProjIndex) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const newProjects = [...projects];
      newProjects[sourceProjIndex].tasks = sourceTasks;
      setProjects(newProjects);

      router.put(route("tasks.reorder"), {
        project_id: projects[sourceProjIndex].id,
        tasks: sourceTasks.map((t) => t.id),
      });
    } else {
      // Move to another project
      const destTasks = Array.from(projects[destProjIndex].tasks || []);
      destTasks.splice(destination.index, 0, movedTask);

      const newProjects = [...projects];
      newProjects[sourceProjIndex].tasks = sourceTasks;
      newProjects[destProjIndex].tasks = destTasks;
      setProjects(newProjects);

      router.put(route("tasks.move"), {
        task_id: movedTask.id,
        from_project: projects[sourceProjIndex].id,
        to_project: projects[destProjIndex].id,
        tasks: destTasks.map((t) => t.id),
      });
    }
  }
};

  const handleAddTask = (projectId: number) => {
    if (!newTaskTitle.trim()) return;
    router.post(
      route("tasks.store"),
      {
        title: newTaskTitle,
        project_id: projectId,
        priority: 1,
      },
      {
        onSuccess: () => {
          setNewTaskTitle("");
          setAddingTaskFor(null);
        },
      }
    );
  };

  const handleDeleteProject = (projectId: number) => {
  if (!confirm("Are you sure you want to delete this project?")) return;

  router.delete(route("projects.destroy", projectId), {
    preserveScroll: true,
    onSuccess: () => {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    },
  });
};


const handleAddProject = () => {
  if (!newProjectName.trim()) return;
  setLoading(true);

  router.post(
    route("projects.store"),
    { name: newProjectName },
    {
      onSuccess: (page) => {
        const newProj = page.props.flash?.newProject;
        if (newProj) {
          setProjects((prev) => [...prev, newProj]);
        }
        setNewProjectName("");
        setAddingProject(false);
        setLoading(false);
      },
    }
  );
};


  useEffect(() => {
    const sorted = initialProjects
      .map((p) => ({
        ...p,
        tasks: [...(p.tasks || [])].sort((a, b) => a.position - b.position),
      }))
      .sort((a, b) => a.position - b.position);

    setProjects(sorted);
  }, [initialProjects]);

  const handleProjectNameChange = (projectId: number, newName: string) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId ? { ...proj, name: newName } : proj
      )
    );
    router.put(route("projects.update", projectId), { name: newName });
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="projects" direction="horizontal" type="PROJECT">
    {(provided) => (
      <div
        className="flex overflow-x-auto space-x-4 pb-2"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {projects.map((proj, projIndex) => (
          <Draggable
            key={proj.id}
            draggableId={`project-${proj.id}`}
            index={projIndex}
          >
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="min-w-[250px] max-w-[250px] max-h-[390px] flex-shrink-0 p-4 shadow-md flex flex-col"
              >
                <div
                  {...provided.dragHandleProps}
                  className="flex items-center justify-between mb-2 cursor-grab"
                >
                <input
                    type="text"
                    value={proj.name}
                    className="text-lg font-bold bg-transparent border-0 focus:ring-0 focus:outline-none w-full"
                    onChange={(e) => {
                      const newName = e.target.value;
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === proj.id ? { ...p, name: newName } : p
                        )
                      );
                    }}
                    onBlur={() => handleProjectNameChange(proj.id, proj.name)}
                  />
                 
                  <button
                    className="cursor-pointer"
                   onClick={() => handleDeleteProject(proj.id)}
                   >
                    <TrashIcon className="w-6 h-6 text-gray-500 hover:text-red-600" />
                  </button>
                </div>
                

                <Droppable
                  droppableId={`project-${proj.id}-tasks`}
                  type="TASK"
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto space-y-2 scrollbar-hover"
                    >
                      {proj.tasks?.map((task, taskIndex) => (
                        <Draggable
                          key={task.id}
                          draggableId={`task-${task.id}`}
                          index={taskIndex}
                        >
                          {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleEditTask(task)}
                            className="p-3 bg-gray-700 rounded shadow-sm w-50 text-left hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer group"
                            role="button"
                            tabIndex={0}
                          >
                            <div className="flex items-center justify-between mb-2 cursor-grab">
                              <Checkbox
                                  checked={task.status === "completed"}
                                  onCheckedChange={(checked) => {
                                    router.put(route("tasks.update", task.id), {
                                      ...task,
                                      status: checked ? "completed" : "incomplete",
                                    });

                                    setProjects((prev) =>
                                      prev.map((proj) => ({
                                        ...proj,
                                        tasks: proj.tasks?.map((t) =>
                                          t.id === task.id
                                            ? { ...t, status: checked ? "completed" : "incomplete" }
                                            : t
                                        ),
                                      }))
                                    );
                                  }}
                                />
                                <p
                                  className={`text-sm font-semibold ${
                                    task.status === "completed" ? "line-through text-gray-400" : ""
                                  }`}
                                >
                                  {task.title}
                                </p>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTask(task);
                                }}
                                className="cursor-pointer"
                              >
                                <EditIcon className="w-4 h-4 text-gray-400 hover:text-white mr-2 hidden group-hover:inline" />
                              </button>
                            </div>

                            <p className="text-xs text-gray-300 hidden group-hover:inline">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                            </p>
                          </div>
                          )}
                        </Draggable>
                      ))}
                    </div>                    
                  )}
                </Droppable>

                 <div className="pt-2 border-t mt-2">
                  {addingTaskFor === proj.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="w-full rounded border px-2 py-1 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddTask(proj.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          {loading ? "Adding..." : "Add Task"}
                        </Button>
                        <Button
                          disabled={loading}
                          onClick={() => {
                            setAddingTaskFor(null);
                            setNewTaskTitle("");
                          }}
                          className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setAddingTaskFor(proj.id)}
                      className="w-full text-left text-blue-600 text-sm font-bold bg-gray-800 hover:bg-gray-700"
                    >
                      + Add Task
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </Draggable>
        ))}
              
              {addingProject ? (
                <Card className="min-w-[250px] max-w-[250px] flex-shrink-0 p-4 flex flex-col gap-2 items-start justify-center">
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Project name"
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleAddProject}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      {loading ? 'Creating...' : 'Submit'}
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setAddingProject(false);
                        setNewProjectName("");
                      }}
                      className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </Card>
              ) : (
                <Card
                  onClick={() => setAddingProject(true)}
                  className="min-w-[250px] max-w-[250px] flex-shrink-0 p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-blue-600 font-bold">+ Create List</span>
                </Card>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
          <TaskModal
            open={taskModalOpen}
            onOpenChange={setTaskModalOpen}
            task={selectedTask}
            onSave={handleSaveTask}
          />
    </div>
  );
}
