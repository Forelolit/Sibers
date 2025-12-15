import { Container, RegisterRequired, SearchInput } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import clsx from 'clsx';
import type { FC } from 'react';
import { AuthContent } from './components/AuthContent';

export const HomePage: FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const containerHeight = isAuth ? 'h-[500px]' : 'h-[700px]';

    return (
        <section>
            <Container>
                {isAuth && <SearchInput />}

                <div className={clsx(containerHeight, 'flex flex-col justify-center items-center min-h-[500px] gap-8')}>
                    {isAuth ? <AuthContent /> : <RegisterRequired />}
                </div>
            </Container>
        </section>
    );
};
