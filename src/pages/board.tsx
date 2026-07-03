import { useState } from "react";
import { useStore } from "../store";
import { useParams } from "react-router-dom";
import type { Task } from "../types";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import TaskModal from "../components/TaskModal";

const columns = [
  { id: "todo", title: "To Do", color: "#6366f1" },
  { id: "inprogress", title: "In Progress", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#22c55e" },
];

function TaskCard({
  task,
  onMove,
  onDelete,
  onOpen,
}: {
  task: Task;
  onMove: (task: Task, status: string) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const priorityColor =
    task.priority === "high"
      ? "#ef4444"
      : task.priority === "medium"
        ? "#f59e0b"
        : "#22c55e";
  const priorityLabel =
    task.priority === "high"
      ? "Высокий"
      : task.priority === "medium"
        ? "Средний"
        : "Низкий";

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        background: "#fff",
        padding: "14px",
        borderRadius: "10px",
        marginBottom: "10px",
        cursor: "grab",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderLeft: "4px solid " + priorityColor,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      {...attributes}
      {...listeners}
    >
      <strong
        style={{ cursor: "pointer", color: "#4f46e5", fontSize: "15px" }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onOpen(task)}
      >
        {task.title}
      </strong>
      <div
        style={{
          fontSize: "12px",
          color: priorityColor,
          marginTop: "4px",
          fontWeight: "bold",
        }}
      >
        {priorityLabel}
      </div>
      {task.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            marginTop: "6px",
          }}
        >
          {task.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#ede9fe",
                color: "#7c3aed",
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "11px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {task.deadline && (
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
          Дедлайн: {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}
      {task.assignee && (
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
          Исполнитель: {task.assignee}
        </div>
      )}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {columns
          .filter((c) => c.id !== task.status)
          .map((c) => (
            <button
              key={c.id}
              onClick={() => onMove(task, c.id)}
              style={{
                padding: "3px 8px",
                fontSize: "11px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                background: "#f9fafb",
              }}
            >
              {c.title}
            </button>
          ))}
        <button
          onClick={() => onDelete(task.id)}
          style={{
            padding: "3px 8px",
            fontSize: "11px",
            borderRadius: "6px",
            border: "1px solid #fee2e2",
            cursor: "pointer",
            background: "#fff5f5",
            color: "#ef4444",
          }}
        >
          X
        </button>
      </div>
    </motion.div>
  );
}

function Board() {
  const { id } = useParams();
  const { tasks, addTask, deleteTask, updateTask } = useStore();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));
  const allAssignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean)),
  );

  const boardTasks = tasks.filter((t) => {
    const matchBoard = t.boardId === id;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority ? t.priority === priority : true;
    const matchTag = tagFilter ? t.tags.includes(tagFilter) : true;
    const matchAssignee = assigneeFilter ? t.assignee === assigneeFilter : true;
    return (
      matchBoard && matchSearch && matchPriority && matchTag && matchAssignee
    );
  });

  const handleAddTask = (status: string) => {
    const title = prompt("Название задачи:");
    if (!title) return;
    const task: Task = {
      id: new Date().getTime().toString(),
      title,
      description: "",
      priority: "medium",
      tags: [],
      createdAt: new Date().toISOString(),
      status: status as Task["status"],
      boardId: id!,
    };
    addTask(task);
  };

  const handleMove = (task: Task, status: string) => {
    updateTask({ ...task, status: status as Task["status"] });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;
    const newStatus = over.id as Task["status"];
    if (columns.find((c) => c.id === newStatus)) {
      updateTask({ ...task, status: newStatus });
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updated) => {
            updateTask(updated);
            setSelectedTask(null);
          }}
        />
      )}
      <h1 style={{ fontSize: "28px", marginBottom: "20px", color: "#4f46e5" }}>
        Доска
      </h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
          background: "#f8fafc",
          padding: "16px",
          borderRadius: "12px",
        }}
      >
        <input
          placeholder="Поиск задач..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            width: "180px",
          }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <option value="">Все приоритеты</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <option value="">Все теги</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <option value="">Все исполнители</option>
          {allAssignees.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {(search || priority || tagFilter || assigneeFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setPriority("");
              setTagFilter("");
              setAssigneeFilter("");
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #fee2e2",
              background: "#fff5f5",
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            Сбросить
          </button>
        )}
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {columns.map((col) => {
            const colTasks = boardTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                style={{
                  flex: 1,
                  background: "#f8fafc",
                  padding: "16px",
                  borderRadius: "12px",
                  minHeight: "300px",
                  borderTop: "4px solid " + col.color,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h2 style={{ fontSize: "16px", color: col.color }}>
                    {col.title}
                  </h2>
                  <span
                    style={{
                      background: col.color,
                      color: "#fff",
                      borderRadius: "20px",
                      padding: "2px 10px",
                      fontSize: "12px",
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleAddTask(col.id)}
                  style={{
                    width: "100%",
                    marginBottom: "12px",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "2px dashed #e5e7eb",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#9ca3af",
                  }}
                >
                  + Добавить задачу
                </button>
                <SortableContext
                  items={colTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={handleMove}
                      onDelete={deleteTask}
                      onOpen={setSelectedTask}
                    />
                  ))}
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
