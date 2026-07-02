export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

export interface Task {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    tags: string[]
    deadline?: string
    assignee?: string
    createdAt: string
    status: 'todo' | 'inprogress' | 'done'
    boardId: string
}

export interface Board {
    id: string
    title: string
    userId: string
}
