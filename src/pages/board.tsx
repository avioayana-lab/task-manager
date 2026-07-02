import { useState } from 'react'
import { useStore } from '../store'
import { useParams } from 'react-router-dom'
import type { Task } from '../types'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskModal from '../components/TaskModal'

const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
]

function TaskCard({ task, onMove, onDelete, onOpen }: { task: Task; onMove: (task: Task, status: string) => void; onDelete: (id: string) => void; onOpen: (task: Task) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    return (
        <div ref={setNodeRef} style={{ ...style, background: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '8px', cursor: 'grab' }} {...attributes} {...listeners}>
            <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onOpen(task)}>{task.title}</strong>
            <div style={{ fontSize: '12px', color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green' }}>
                {task.priority === 'high' ? '🔴 Высокий' : task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {columns.filter((c) => c.id !== task.status).map((c) => (
                    <button key={c.id} onClick={() => onMove(task, c.id)}>{c.title}</button>
                ))}
                <button onClick={() => onDelete(task.id)}>X</button>
            </div>
        </div>
    )
}

function Board() {
    const { id } = useParams()
    const { tasks, addTask, deleteTask, updateTask } = useStore()
    const [search, setSearch] = useState('')
    const [priority, setPriority] = useState('')
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const boardTasks = tasks.filter((t) => {
        const matchBoard = t.boardId === id
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
        const matchPriority = priority ? t.priority === priority : true
        return matchBoard && matchSearch && matchPriority
    })

    const handleAddTask = (status: string) => {
        const title = prompt('Название задачи:')
        if (!title) return
        const task: Task = {
            id: new Date().getTime().toString(),
            title,
            description: '',
            priority: 'medium',
            tags: [],
            createdAt: new Date().toISOString(),
            status: status as Task['status'],
            boardId: id!,
        }
        addTask(task)
    }

    const handleMove = (task: Task, status: string) => {
        updateTask({ ...task, status: status as Task['status'] })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return
        const task = tasks.find((t) => t.id === active.id)
        if (!task) return
        const newStatus = over.id as Task['status']
        if (columns.find((c) => c.id === newStatus)) {
            updateTask({ ...task, status: newStatus })
        }
    }

    return (
        <div style={{ padding: '40px' }}>
            {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
            <h1>Доска</h1>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    placeholder="Поиск задач..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '200px' }}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                    <option value="">Все приоритеты</option>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                </select>
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {columns.map((col) => {
                        const colTasks = boardTasks.filter((t) => t.status === col.id)
                        return (
                            <div key={col.id} style={{ flex: 1, background: '#f4f4f4', padding: '16px', borderRadius: '8px', minHeight: '200px' }}>
                                <h2>{col.title}</h2>
                                <button onClick={() => handleAddTask(col.id)} style={{ marginBottom: '10px' }}>
                                    + Задача
                                </button>
                                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                                    {colTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} onMove={handleMove} onDelete={deleteTask} onOpen={setSelectedTask} />
                                    ))}
                                </SortableContext>
                            </div>
                        )
                    })}
                </div>
            </DndContext>
        </div>
    )
}

export default Board
