
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'
import type { Board } from '../types'

function Boards() {
    const { boards, addBoard, deleteBoard } = useStore()
    const navigate = useNavigate()

    const handleAddBoard = () => {
        const title = prompt('Название доски:')
        if (!title) return
        const board: Board = {
            id: Date.now().toString(),
            title,
            userId: '1',
        }
        addBoard(board)
    }

    return (
        <div style={{ padding: '40px' }}>
            <h1>Мои доски</h1>
            <button onClick={handleAddBoard} style={{ padding: '10px 20px', marginBottom: '20px' }}>
                + Новая доска
            </button>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {boards.map((board) => (
                    <div key={board.id} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', minWidth: '200px' }}>
                        <h3>{board.title}</h3>
                        <button onClick={() => navigate('/board/' + board.id)} style={{ marginRight: '10px' }}>
                            Открыть
                        </button>
                        <button onClick={() => deleteBoard(board.id)}>
                            Удалить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Boards
