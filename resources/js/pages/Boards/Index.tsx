import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { Link, router } from "@inertiajs/react";
import { Boards } from "@/types/models";
import {  Edit,  Trash } from "lucide-react";

interface Props {
  boards: Boards[];
}

export default function BoardIndex({ boards: initialBoards }: Props) {
  const [boards, setBoards] = useState(initialBoards);
  const [addBoard, setAddBoard] = useState(false);
  const [openEditBoard, setOpenEditBoard] = useState(false);
  const [isChecked, setisCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBoard, setNewBoard] = useState({
    title: "",
    description: "",
    created_by_ai: isChecked,
    instruction: "",
  });


  const [editBoard, setEditBoard] = useState({
    id: 0,
    title: "",
    description: "",
  });


 const handleDeleteBoard = (id: number) => {
    if (!confirm("Are you sure you want to delete this board?")) return;
    router.delete(route("boards.destroy", id), {
      onSuccess: () => {
        setBoards((prev) => prev.filter((b) => b.id !== id));
      },
    });
  };

  const handleEditClick = (board: Boards) => {
  setEditBoard({ id: board.id, title: board.title, description: board.description });
  setOpenEditBoard(true);
};


  const handleEditBoard = () => {
  if (!editBoard.title.trim()) return;
  router.put(route("boards.update", editBoard.id), {
    title: editBoard.title,
    description: editBoard.description,
  }, {
    onSuccess: () => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === editBoard.id ? { ...b, title: editBoard.title, description: editBoard.description } : b
        )
      );
      setOpenEditBoard(false);
    },
  });
};


  const handleAddBoard = () => {
    if (!newBoard.title.trim()) return;

    setLoading(true);

    const metadataPayload = isChecked ? { instruction: newBoard.instruction } : {};

    router.post(route("boards.store"), {
      title: newBoard.title,
      description: newBoard.description,
      created_by_ai: isChecked,
      metadata: metadataPayload,
    }, {
      onSuccess: (response) => {
        setBoards((prev) => [...prev, response.board]);
        setNewBoard({ title: "", description: "", created_by_ai: false, instruction: "" });
        setisCheck(false);
        setAddBoard(false);
      },
      onFinish: () => setLoading(false),
    });
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Boards</h1>
          <Button onClick={() => setAddBoard(true)} className="bg-blue-800 text-white">+ Add Board</Button>
        </div>
        {boards.length > 0 ? (
          <div className="space-y-2">
            {boards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border"
              >
                <Link href={`/boards/${board.id}`} className="flex-1">
                  <p className="font-medium text-base">{board.title}</p>
                  {board.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {board.description}
                    </p>
                  )}
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditClick(board)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            <p className="mb-4 text-lg">You don’t have any boards yet.</p>
            <Button onClick={() => setAddBoard(true)}>
              Create your first board
            </Button>
          </div>
        )}
      </div>


  {/* Modal For Editing Board */}

      {openEditBoard && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl"
    onClick={() => setOpenEditBoard(false)}
  >
    <div
      className="max-w-2xl w-full rounded-2xl p-10 bg-gradient-to-br from-black/60 to-gray-900/60 border border-gray-800/40 shadow-2xl flex flex-col items-center gap-6"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        value={editBoard.title}
        onChange={(e) =>
          setEditBoard({ ...editBoard, title: e.target.value })
        }
        placeholder="Board name"
        className="w-full rounded border px-2 py-1 text-sm"
      />
      <input
        type="text"
        value={editBoard.description}
        onChange={(e) =>
          setEditBoard({ ...editBoard, description: e.target.value })
        }
        placeholder="Description (optional)"
        className="w-full rounded border px-2 py-1 text-sm"
      />

      <div className="flex gap-3 w-full justify-end">
        <Button variant="secondary" onClick={() => setOpenEditBoard(false)}>
          Cancel
        </Button>
        <Button onClick={handleEditBoard}>Save Changes</Button>
      </div>
    </div>
  </div>
)}

    
  {/* Modal for adding board */}
    {addBoard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-xl"
          onClick={() => setAddBoard(false)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl p-10 bg-gradient-to-br from-black/60 to-gray-900/60 border border-gray-800/40 shadow-2xl flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()} 
          >
            <input
              type="text"
              value={newBoard.title}
              onChange={(e) =>
                setNewBoard({ ...newBoard, title: e.target.value })
              }
              placeholder="Board name"
              className="w-full rounded border px-2 py-1 text-sm"
            />
            <input
              type="text"
              value={newBoard.description}
              onChange={(e) =>
                setNewBoard({ ...newBoard, description: e.target.value })
              }
              placeholder="Description (optional)"
              className="w-full rounded border px-2 py-1 text-sm"
            />
      <div>
          <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setisCheck(e.target.checked)}
            />
            <label className="text-sm ml-2">Create with AI?</label>
      </div>
            {isChecked && (
              <input
                type="text"
                value={newBoard.instruction}
                onChange={(e) =>
                  setNewBoard({ ...newBoard, instruction: e.target.value })
                }
                placeholder="Add instruction e.g. 'I will create a user login page'"
                className="w-full rounded border px-2 py-1 text-sm"
              />
            )}

            <div className="flex gap-3 w-full justify-end">
              <Button
                variant="secondary"
                onClick={() => setAddBoard(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBoard} disabled={loading} className={loading ? 'opacity-50' : ''}>
                {loading ? 'Creating...' : 'Create Board'}
              </Button>

            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
