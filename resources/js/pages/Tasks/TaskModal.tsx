import { Button } from "@headlessui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: { id: number; title: string, description: string, due_date: string, priority: number} | null;
  onSave: (id: number, title: string, description: string, due_date: string, priority: number) => void;
}

export default function TaskModal({ open, onOpenChange, task, onSave }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("0");

  const handleDelete = (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    router.delete(route("tasks.destroy", taskId), {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

        useEffect(() => {
          setTitle(task?.title || "");
          setDescription(task?.description || "");
          setDueDate(task?.due_date || "");
          setPriority(task?.priority?.toString() || "0");
        }, [task]);

        const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task) {
          onSave(task.id, title, description, dueDate, parseInt(priority));
          onOpenChange(false);
        }
    };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-200 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Dialog.Title className="text-lg font-bold mb-4">Edit Task</Dialog.Title>
          <Button 
          className={"cursor-pointer p-2 rounded text-red-700 hover:text-red-600 transition-colors"}
          onClick={() => task && handleDelete(task.id)}
          ><TrashIcon /></Button>
        </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
                
              <input
                type="text"
                id="task-title"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            
            <textarea
                id="description"
                placeholder="Description"
                className="w-full border border-gray-300 rounded p-3 mt-4"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

           <label className="block text-sm font-medium mb-1">Priority</label>
         <RadioGroup
            value={priority.toString()}
            onValueChange={(v) => setPriority(v)}
            className="flex gap-4 p-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="low" />
              <Label htmlFor="low" className="text-green-500">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="medium" />
              <Label htmlFor="medium" className="text-yellow-500">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="high" />
              <Label htmlFor="high" className="text-red-500">High</Label>
            </div>
          </RadioGroup>

            <label htmlFor="due_date" className="block text-sm font-medium  mb-1">
                Due Date
            </label>

            <input
                type="date"
                id="due_date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                 value={dueDate}
                 onChange={(e) => setDueDate(e.target.value)}
            />


            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
