import { useForm } from 'react-hook-form'
import { useStore } from '../store'

interface LoginForm {
    name: string
    email: string
}

function Login() {
    const { register, handleSubmit } = useForm<LoginForm>()
    const setUser = useStore((state) => state.setUser)

    const onSubmit = (data: LoginForm) => {
        const user = {
            id: '1',
            name: data.name,
            email: data.email,
        }
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        window.location.href = '/boards'
    }

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', border: '1px solid #ccc', borderRadius: '12px' }}>
            <h1 style={{ textAlign: 'center' }}>Вход</h1>
            <div>
                <input
                    {...register('name')}
                    placeholder="Ваше имя"
                    style={{ display: 'block', marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                    {...register('email')}
                    placeholder="Email"
                    style={{ display: 'block', marginBottom: '20px', padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button
                    onClick={handleSubmit(onSubmit)}
                    style={{ padding: '10px 20px', width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
                >
                    Войти
                </button>
            </div>
        </div>
    )
}

export default Login