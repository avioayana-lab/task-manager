import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Board, User } from "../types";

interface AppState {
  user: User | null;
  boards: Board[];
  tasks: Task[];
  setUser: (user: User | null) => void;
  addBoard: (board: Board) => void;
  deleteBoard: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      boards: [],
      tasks: [],
      setUser: (user) => set({ user }),
      addBoard: (board) =>
        set((state) => ({ boards: [...state.boards, board] })),
      deleteBoard: (id) =>
        set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: "task-manager-storage",
    },
  ),
);
