import { Container, RegisterRequired, SearchInput } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import clsx from 'clsx';
import type { FC } from 'react';
import { AuthContent } from './components/AuthContent';

/**
 * Home page component.
 *
 * Renders different content depending on the authentication state:
 * - For authenticated users: shows search input and main application entry content.
 * - For unauthenticated users: shows registration requirement component.
 *
 * Layout height is adjusted based on authentication state to keep the UI balanced.
 */

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
