import { Button, Container, Input } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import clsx from 'clsx';
import { Ban, Check, EyeIcon, EyeOffIcon, X } from 'lucide-react';
import { useState, type FC } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type Inputs = {
    id: string;
    name: string;
    password: string;
    repeatPassword: string;
};

const passwordRules = [{ label: 'Минимум 6 символов', test: (val: string) => val.length >= 6 }];

export const RegisterPage: FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.setUser);
    const currentUser = useAuthStore((state) => state.user);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (currentUser) {
            toast('Current user is active', {
                icon: <Ban color="red" />,
                position: 'top-right',
            });
            return false;
        }
        user({ uid: crypto.randomUUID(), displayName: data.name });
        navigate('/');
    };
    const password = watch('password', '');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <section>
            <Container>
                <div className="h-[500px] flex gap-6 flex-col justify-center items-center">
                    <h1 className="text-gray-700 text-3xl font-bold">Registration</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 w-[500px]">
                        <Input
                            placeholder="Введите имя"
                            autoComplete="username"
                            {...register('name', {
                                required: 'Имя обязательно для заполнения',
                                pattern: {
                                    value: /^[A-Za-z]+$/i,
                                    message: 'Имя должно содержать только латинские буквы',
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Максимум 20 символов',
                                },
                                minLength: {
                                    value: 3,
                                    message: 'Минимум 3 символа',
                                },
                            })}
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                        <div className="flex gap-1">
                            <Input
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="Введите пароль"
                                autoComplete="new-password"
                                {...register('password', {
                                    required: 'Пароль обязателен',
                                    validate: (val) => {
                                        for (const rule of passwordRules) {
                                            if (!rule.test(val)) return 'Пароль не соответствует требованиям';
                                        }
                                        return true;
                                    },
                                })}
                            />
                            {!isPasswordVisible ? (
                                <Button onClick={() => setIsPasswordVisible(true)}>
                                    <EyeIcon />
                                </Button>
                            ) : (
                                <Button onClick={() => setIsPasswordVisible(false)}>
                                    <EyeOffIcon />
                                </Button>
                            )}
                        </div>

                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                        <ul>
                            {passwordRules.map((rule) => (
                                <li
                                    key={rule.label}
                                    className={clsx(
                                        `${rule.test(password) ? 'text-green-500' : 'text-red-500'} flex items-center`,
                                    )}>
                                    {rule.test(password) ? <Check /> : <X />} {rule.label}
                                </li>
                            ))}
                        </ul>

                        <Input
                            type="password"
                            autoComplete="pass"
                            placeholder="Повторите пароль"
                            {...register('repeatPassword', {
                                required: 'Повторите пароль',
                                validate: (value) => value === password || 'Пароли не совпадают',
                            })}
                        />
                        {errors.repeatPassword && <p className="text-red-500">{errors.repeatPassword.message}</p>}

                        <Button>Регистрация</Button>
                    </form>
                </div>
            </Container>
        </section>
    );
};
