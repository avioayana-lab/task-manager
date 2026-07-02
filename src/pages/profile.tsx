import { useState } from 'react'
import { useStore } from '../store'

function Profile() {
    const { user, setUser } = useStore()
    const [name, setName] = useState(user?.name || '')

    const handleSave = () => {
        if (!user) return
        const updated = { ...user, name }
        localStorage.setItem('user', JSON.stringify(updated))
        setUser(updated)
        alert('Сохранено!')
    }

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Профиль</h1>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', marginBottom: '20px' }}>
                    {name.charAt(0).toUpperCase()}
                </div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    style={{ display: 'block', padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '10px' }}
                />
                <p style={{ color: '#888' }}>{user?.email}</p>
                <button
                    onClick={handleSave}
                    style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Сохранить
                </button>
            </div>
        </div>
    )
}

export default Profile