import type { Task } from '../types'

interface Props {
    task: Task
    onClose: () => void
}

function TaskModal({ task, onClose }: Props) {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', minWidth: '400px', maxWidth: '600px', color: '#000' }}>
                <h2>{task.title}</h2>
                <p style={{ marginTop: '10px', color: '#666' }}>
                    Приоритет: {task.priority === 'high' ? '🔴 Высокий' : task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
                </p>
                <p style={{ marginTop: '10px', color: '#666' }}>
                    Создано: {new Date(task.createdAt).toLocaleDateString()}
                </p>
                <p style={{ marginTop: '10px', color: '#666' }}>
                    Статус: {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : 'Done'}
                </p>
                <button
                    onClick={onClose}
                    style={{ marginTop: '20px', padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Закрыть
                </button>
            </div>
        </div>
    )
}

export default TaskModal