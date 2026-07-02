import { useState } from 'react'
import { useStore } from '../store'
import { useParams } from 'react-router-dom'
import type { Task } from '../types'

const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
]

function Board() {
    const { id } = useParams()
    const { tasks, addTask, deleteTask, updateTask } = useStore()
    const [search, setSearch] = useState('')
    const [priority, setPriority] = useState('')

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

    return (
        <div style={{ padding: '40px' }}>
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
            <div style={{ display: 'flex', gap: '20px' }}>
                {columns.map((col) => (
                    <div key={col.id} style={{ flex: 1, background: '#f4f4f4', padding: '16px', borderRadius: '8px' }}>
                        <h2>{col.title}</h2>
                        <button onClick={() => handleAddTask(col.id)} style={{ marginBottom: '10px' }}>
                            + Задача
                        </button>
                        {boardTasks
                            .filter((t) => t.status === col.id)
                            .map((task) => (
                                <div key={task.id} style={{ background: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '8px' }}>
                                    <strong>{task.title}</strong>
                                    <div style={{ fontSize: '12px', color: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green' }}>
                                        {task.priority === 'high' ? '🔴 Высокий' : task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
                                    </div>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                                        {columns
                                            .filter((c) => c.id !== task.status)
                                            .map((c) => (
                                                <button key={c.id} onClick={() => handleMove(task, c.id)}>
                                                    {c.title}
                                                </button>
                                            ))}
                                        <button onClick={() => deleteTask(task.id)}>X</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Board