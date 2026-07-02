import { useState } from 'react'
import type { Task } from '../types'

interface Props {
    task: Task
    onClose: () => void
    onSave: (task: Task) => void
}

function TaskModal({ task, onClose, onSave }: Props) {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [priority, setPriority] = useState(task.priority)
    const [deadline, setDeadline] = useState(task.deadline || '')
    const [assignee, setAssignee] = useState(task.assignee || '')
    const [tags, setTags] = useState(task.tags.join(', '))

    const handleSave = () => {
        onSave({
            ...task,
            title,
            description,
            priority,
            deadline,
            assignee,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        })
        onClose()
    }

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '520px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ background: '#4f46e5', padding: '24px', color: '#fff' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Редактировать задачу</h2>
                    <p style={{ opacity: 0.7, fontSize: '14px' }}>Создано: {new Date(task.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ padding: '24px', color: '#000' }}>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>НАЗВАНИЕ</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px', fontSize: '16px' }}
                    />
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>ОПИСАНИЕ</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Добавьте описание..."
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px', height: '80px', resize: 'none' }}
                    />
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>ПРИОРИТЕТ</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            >
                                <option value="low">Низкий</option>
                                <option value="medium">Средний</option>
                                <option value="high">Высокий</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>ДЕДЛАЙН</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            />
                        </div>
                    </div>
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>ИСПОЛНИТЕЛЬ</label>
                    <input
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Кому назначена задача?"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px' }}
                    />
                    <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>ТЕГИ (через запятую)</label>
                    <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="дизайн, фронтенд, срочно"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSave}
                            style={{ flex: 1, padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                        >
                            Сохранить
                        </button>
                        <button
                            onClick={onClose}
                            style={{ padding: '12px 20px', background: '#f3f4f6', color: '#666', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal