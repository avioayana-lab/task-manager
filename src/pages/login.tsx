import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStore } from '../store'

const loginSchema = z.object({
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль минимум 6 символов'),
})

const registerSchema = z.object({
    name: z.string().min(2, 'Имя минимум 2 символа'),
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Пароль минимум 6 символов'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const setUser = useStore((state) => state.setUser)

    const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
    const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

    const onLogin = (data: LoginForm) => {
        const saved = localStorage.getItem('users')
        const users = saved ? JSON.parse(saved) : []
        const found = users.find((u: RegisterForm & { id: string }) => u.email === data.email)
        if (!found) {
            alert('Пользователь не найден!')
            return
        }
        localStorage.setItem('user', JSON.stringify(found))
        setUser(found)
        window.location.href = '/boards'
    }

    const onRegister = (data: RegisterForm) => {
        const saved = localStorage.getItem('users')
        const users = saved ? JSON.parse(saved) : []
        const exists = users.find((u: RegisterForm) => u.email === data.email)
        if (exists) {
            alert('Пользователь уже существует!')
            return
        }
        const user = { id: String(Date.now()), ...data }
        users.push(user)
        localStorage.setItem('users', JSON.stringify(users))
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        window.location.href = '/boards'
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', width: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
                <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '32px', color: '#fff', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>🗂️ Task Manager</h1>
                    <p style={{ opacity: 0.8 }}>{isRegister ? 'Создайте аккаунт' : 'Войдите в систему'}</p>
                </div>
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', marginBottom: '24px', background: '#f3f4f6', borderRadius: '10px', padding: '4px' }}>
                        <button
                            onClick={() => setIsRegister(false)}
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: !isRegister ? '#fff' : 'transparent', fontWeight: !isRegister ? 'bold' : 'normal', color: !isRegister ? '#4f46e5' : '#6b7280', boxShadow: !isRegister ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                        >
                            Вход
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: isRegister ? '#fff' : 'transparent', fontWeight: isRegister ? 'bold' : 'normal', color: isRegister ? '#4f46e5' : '#6b7280', boxShadow: isRegister ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                        >
                            Регистрация
                        </button>
                    </div>

                    {!isRegister ? (
                        <div>
                            <input
                                {...loginForm.register('email')}
                                placeholder="Email"
                                style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '4px', fontSize: '15px' }}
                            />
                            {loginForm.formState.errors.email && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{loginForm.formState.errors.email.message}</p>}
                            <input
                                {...loginForm.register('password')}
                                type="password"
                                placeholder="Пароль"
                                style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '4px', fontSize: '15px', marginTop: '12px' }}
                            />
                            {loginForm.formState.errors.password && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{loginForm.formState.errors.password.message}</p>}
                            <button
                                onClick={loginForm.handleSubmit(onLogin)}
                                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '16px' }}
                            >
                                Войти →
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
                                Нет аккаунта? <span style={{ color: '#4f46e5', cursor: 'pointer' }} onClick={() => setIsRegister(true)}>Зарегистрируйтесь</span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <input
                                {...registerForm.register('name')}
                                placeholder="Ваше имя"
                                style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '4px', fontSize: '15px' }}
                            />
                            {registerForm.formState.errors.name && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{registerForm.formState.errors.name.message}</p>}
                            <input
                                {...registerForm.register('email')}
                                placeholder="Email"
                                style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '4px', fontSize: '15px', marginTop: '12px' }}
                            />
                            {registerForm.formState.errors.email && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{registerForm.formState.errors.email.message}</p>}
                            <input
                                {...registerForm.register('password')}
                                type="password"
                                placeholder="Пароль"
                                style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '4px', fontSize: '15px', marginTop: '12px' }}
                            />
                            {registerForm.formState.errors.password && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{registerForm.formState.errors.password.message}</p>}
                            <button
                                onClick={registerForm.handleSubmit(onRegister)}
                                style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '16px' }}
                            >
                                Зарегистрироваться →
                            </button>
                            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
                                Уже есть аккаунт? <span style={{ color: '#4f46e5', cursor: 'pointer' }} onClick={() => setIsRegister(false)}>Войдите</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login