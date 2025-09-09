import * as Dialog from "@radix-ui/react-dialog";
import { set } from "date-fns";
import { useState, useEffect } from "react";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: { id: number; title: string, description: string } | null;
  onSave: (id: number, title: string, description: string) => void;
}

export default function TaskModal({ open, onOpenChange, task, onSave }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onSave(task.id, title, description);
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-106 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">Edit Task</Dialog.Title>
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
