import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStore } from '../store'

const schema = z.object({
    name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
    email: z.string().email('Введите корректный email'),
})

type LoginForm = z.infer<typeof schema>

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    })
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
                    style={{ display: 'block', marginBottom: '4px', padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                {errors.name && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.name.message}</p>}
                <input
                    {...register('email')}
                    placeholder="Email"
                    style={{ display: 'block', marginBottom: '4px', padding: '10px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                {errors.email && <p style={{ color: 'red', marginBottom: '10px' }}>{errors.email.message}</p>}
                <button
                    onClick={handleSubmit(onSubmit)}
                    style={{ padding: '10px 20px', width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
                >
                    Войти
                </button>
            </div>
        </div>
    )
}

export default Login